# main.py（最终版，支持 Web 前端）

import json
import random
from flask import Flask, jsonify, request, send_from_directory

# 加载题目
with open(
    "exam_questions.json", "r", encoding="utf-8"
) as f:
    questions = json.load(f)


def get_random_question():
    return random.choice(questions)


def check_answer(question, user_answer: str):
    user = user_answer.strip().upper()

    if question["type"] == "true_false":
        # 用户选 A → 正确；选 B → 错误
        user_is_correct = user == "A"
        expected_answer = question["answer"].strip().upper()
        # 假设 "T" 或 "√" 表示正确，"X" 或 "F" 表示错误
        correct_is_true = expected_answer in ("V")
        return user_is_correct == correct_is_true

    else:
        # 单选题：直接比较字母
        correct = question["answer"].strip().upper()
        return user == correct


app = Flask(__name__)


# =================== API 接口 ===================
@app.route("/api/get_question")
def api_get_question():
    q = get_random_question()

    if q["type"] == "true_false":
        # 判断题：只返回两个固定选项
        options = ["正确", "错误"]
    else:
        # 单选题：清理选项（去掉（A）等前缀）
        options = [
            opt.split("）", 1)[1] if "）" in opt else opt for opt in q["options"]
        ]

    return jsonify(
        {
            "id": str(hash(q["question"])),
            "type": q["type"],
            "question": q["question"],
            "options": options,
            "answer": q["answer"],  # 可选：传回答案用于调试
        }
    )


@app.route("/api/submit_answer", methods=["POST"])
@app.route("/api/submit_answer", methods=["POST"])
def api_submit_answer():
    data = request.get_json()
    user_ans = data.get("answer", "")
    q_text = data.get("question_text", "")

    matched_q = next((q for q in questions if q["question"] == q_text), None)
    if not matched_q:
        return jsonify({"error": "题目未找到"}), 400

    is_correct = check_answer(matched_q, user_ans)

    # 生成解析
    if matched_q["type"] == "true_false":
        correct_text = (
            "正确"
            if matched_q["answer"].strip().upper() in ("T", "√", "正确")
            else "错误"
        )
        explanation = f"正确答案是：{correct_text}"
    else:
        # 单选题
        correct_letter = matched_q["answer"].strip().upper()
        try:
            option_text = matched_q["options"][ord(correct_letter) - ord("A")]
            explanation = (
                f'正确答案是（{correct_letter}）{option_text.split("）", 1)[-1]}'
            )
        except:
            explanation = f"正确答案是：{correct_letter}"

    return jsonify(
        {"correct": is_correct, "explanation": explanation if not is_correct else ""}
    )


# =================== 提供前端页面 ===================
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)


# =================== 启动服务 ===================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
