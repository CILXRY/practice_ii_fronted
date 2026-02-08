<template>
  <div v-if="!currentQuestion" class="text-center py-10"> 加载中 ...</div>
  <div
    class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
  >
    <!-- 题目区域 -->
    <div class="p-6 md:p-8">
      <!-- 进度条 -->
      <div class="mb-4 text-sm text-gray-600 mx-auto">
        第 {{ currentIndex + 1 }} 题 / 共 {{ allQuestions.length }} 题
      </div>
      <!-- 题干 -->
      <div class="mb-8">
        <div
          class="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4"
        >
          {{ currentQuestion?.category || " 通用 " }}
        </div>
        <h2
          class="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed"
        >
          {{ currentQuestion?.question_text }}
        </h2>
      </div>

      <!-- 选项 -->
      <div class="space-y-3 mb-8">
        <label
          v-for="(text, key) in currentQuestion?.answer_list"
          :key="key"
          class="flex items-start p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm"
          :class="{
            'border-indigo-500 bg-indigo-50 shadow-inner':
              selectedAnswer === key,
            'border-gray-200 hover:border-gray-300': selectedAnswer !== key,
          }"
        >
          <input
            type="radio"
            name="answer"
            :value="key"
            v-model="selectedAnswer"
            class="mt-1.5 mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
          />
          <span class="text-gray-800">
            <span class="font-bold text-indigo-700 mr-2">{{ key }}.</span>
            {{ text }}
          </span>
        </label>
      </div>

      <!-- 按钮区 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="handleSubmit"
          :disabled="!selectedAnswer"
          class="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-xl disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          提交答案
        </button>
        <button
          @click="nextQuestion"
          class="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          下一题
        </button>
      </div>

      <!-- 反馈区 -->
      <div
        v-if="showFeedback"
        class="mt-8 pt-6 border-t border-gray-100 animate-fade-in"
      >
        <div
          :class="
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          "
          class="p-4 rounded-xl border mb-4"
        >
          <div class="flex items-center gap-2">
            <span v-if="isCorrect" class="text-green-600 text-xl"> ✅ </span>
            <span v-else class="text-red-600 text-xl"> ❌ </span>
            <span class="font-bold text-lg">
              {{ isCorrect ? " 回答正确！" : " 再想想哦～" }}
            </span>
          </div>
          <p class="mt-2 text-gray-700">
            正确答案是：<span class="font-bold text-indigo-700">{{
              currentQuestion?.answer_cor
            }}</span>
          </p>
        </div>

        <div v-if="currentQuestion?.analysis" class="prose prose-sm max-w-none">
          <p class="font-medium text-gray-800 mb-1"> 💡 解析：</p>
          <p class="text-gray-700">{{ currentQuestion?.analysis }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const allQuestions = ref([]); // 所有题目
const currentIndex = ref(0); // 当前题号

// const currentQuestion = ref(null);
const selectedAnswer = ref("");
const showFeedback = ref(false);

const currentQuestion = computed(() => {
  return allQuestions.value[currentIndex.value] || null;
});

const isCorrect = computed(() => {
  if (!selectedAnswer.value || !currentQuestion.value) return null;
  return selectedAnswer.value === currentQuestion.value.answer_cor;
});

const loadQuestions = async () => {
  try {
    const res = await fetch(`http://8.159.156.167:8223/question/get_question?category=%E7%BB%9F%E4%B8%80%E6%B5%8B%E8%AF%95&limit=10`);
    const data = await res.json();
    allQuestions.value = data;
    currentIndex.value = 0;
    resetState();
  } catch (err) {
    console.error(" 加载题目失败 ", err);
  }
};

const resetState = () => {
  selectedAnswer.value = "";
  showFeedback.value = false;
};

const handleSubmit = () => {
  if (!selectedAnswer.value) return;
  showFeedback.value = true;
};

const nextQuestion = () => {
  if (currentIndex.value < allQuestions.value.length - 1) {
    currentIndex.value++;
    resetState();
  } else {
    // 最后一题了，可以提示“重新开始”或加载新批次
    alert(" 这是最后一题啦！点击重新开始 ");
    loadQuestions(); // 或者只重置 index
  }
};

onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
/* 轻微淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
