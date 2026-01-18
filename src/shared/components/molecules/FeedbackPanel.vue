<template>
  <div :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-4 space-y-4']">
    <h3 :class="theme.textPrimary" class="font-semibold">Add Feedback</h3>

    <!-- Feedback Type Selection -->
    <div class="flex gap-2">
      <Button
        :class="feedbackType === 'text' ? 'bg-accent' : ''"
        :variant="feedbackType === 'text' ? 'default' : 'outline'"
        size="sm"
        @click="feedbackType = 'text'"
      >
        Text
      </Button>
      <Button
        :class="feedbackType === 'video' ? 'bg-accent' : ''"
        :variant="feedbackType === 'video' ? 'default' : 'outline'"
        size="sm"
        @click="feedbackType = 'video'"
      >
        Video
      </Button>
      <Button
        :class="feedbackType === 'audio' ? 'bg-accent' : ''"
        :variant="feedbackType === 'audio' ? 'default' : 'outline'"
        size="sm"
        @click="feedbackType = 'audio'"
      >
        Audio
      </Button>
    </div>

    <!-- Text Feedback -->
    <div v-if="feedbackType === 'text'" class="space-y-2">
      <Textarea
        v-model="textContent"
        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
        placeholder="Enter your feedback..."
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
        :class="[theme.borderSecondary, theme.textPrimary]"
        size="sm"
        variant="outline"
        @click="fileInputRef?.click()"
      >
        <Upload class="h-4 w-4" />
        Upload {{ feedbackType === 'video' ? 'Video' : 'Audio' }}
      </Button>
      <p v-if="fileContent" :class="theme.textSecondary" class="text-sm">
        File selected: {{ fileContent.name }}
      </p>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end gap-2">
      <Button
        :class="[theme.textSecondary, theme.bgButtonHover]"
        size="sm"
        variant="ghost"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        :disabled="!canSubmit"
        :loading="isSubmitting"
        size="sm"
        variant="accent"
        @click="handleSubmit"
      >
        Submit Feedback
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { Button } from '@/shared/components/shadcn/button'
import { Upload } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

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
