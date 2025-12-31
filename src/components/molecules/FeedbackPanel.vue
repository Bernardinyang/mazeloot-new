<template>
  <div :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-4 space-y-4']">
    <h3 :class="theme.textPrimary" class="font-semibold">Add Feedback</h3>

    <!-- Feedback Type Selection -->
    <div class="flex gap-2">
      <Button
        :variant="feedbackType === 'text' ? 'default' : 'outline'"
        size="sm"
        :class="feedbackType === 'text' ? 'bg-teal-500' : ''"
        @click="feedbackType = 'text'"
      >
        Text
      </Button>
      <Button
        :variant="feedbackType === 'video' ? 'default' : 'outline'"
        size="sm"
        :class="feedbackType === 'video' ? 'bg-teal-500' : ''"
        @click="feedbackType = 'video'"
      >
        Video
      </Button>
      <Button
        :variant="feedbackType === 'audio' ? 'default' : 'outline'"
        size="sm"
        :class="feedbackType === 'audio' ? 'bg-teal-500' : ''"
        @click="feedbackType = 'audio'"
      >
        Audio
      </Button>
    </div>

    <!-- Text Feedback -->
    <div v-if="feedbackType === 'text'" class="space-y-2">
      <Textarea
        v-model="textContent"
        placeholder="Enter your feedback..."
        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
        rows="4"
      />
    </div>

    <!-- Video/Audio Upload -->
    <div v-if="feedbackType === 'video' || feedbackType === 'audio'" class="space-y-2">
      <input
        ref="fileInputRef"
        :accept="feedbackType === 'video' ? 'video/*' : 'audio/*'"
        class="hidden"
        type="file"
        @change="handleFileSelect"
      />
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary]"
        @click="fileInputRef?.click()"
      >
        <Upload class="mr-2 h-4 w-4" />
        Upload {{ feedbackType === 'video' ? 'Video' : 'Audio' }}
      </Button>
      <p v-if="fileContent" class="text-sm" :class="theme.textSecondary">
        File selected: {{ fileContent.name }}
      </p>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        :class="[theme.textSecondary, theme.bgButtonHover]"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        size="sm"
        class="bg-teal-500 hover:bg-teal-600 text-white"
        :disabled="!canSubmit || isSubmitting"
        @click="handleSubmit"
      >
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Submit Feedback
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import { Upload, Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  mediaId: {
    type: String,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  submit: (type, content) => true,
  cancel: () => true,
})

const theme = useThemeClasses()

const feedbackType = ref('text')
const textContent = ref('')
const fileInputRef = ref(null)
const fileContent = ref(null)

const canSubmit = computed(() => {
  if (feedbackType.value === 'text') {
    return textContent.value.trim().length > 0
  }
  return fileContent.value !== null
})

const handleFileSelect = event => {
  const file = event.target.files?.[0]
  if (file) {
    fileContent.value = file
  }
}

const handleSubmit = () => {
  if (!canSubmit.value) return

  let content
  if (feedbackType.value === 'text') {
    content = textContent.value.trim()
  } else {
    // In production, upload file first and get URL
    content = URL.createObjectURL(fileContent.value)
  }

  emit('submit', feedbackType.value, content)

  // Reset
  feedbackType.value = 'text'
  textContent.value = ''
  fileContent.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleCancel = () => {
  emit('cancel')
  feedbackType.value = 'text'
  textContent.value = ''
  fileContent.value = null
}
</script>
