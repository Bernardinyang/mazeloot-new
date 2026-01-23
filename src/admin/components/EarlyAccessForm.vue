<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Discount Percentage</label>
      <input v-model.number="form.discount_percentage" type="number" min="0" max="100" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Feature Flags</label>
      <input v-model="featureFlagsInput" type="text" placeholder="comma-separated" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
    </div>
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.modelValue })
const featureFlagsInput = ref((props.modelValue.feature_flags || []).join(', '))

const handleSubmit = () => {
  form.value.feature_flags = featureFlagsInput.value.split(',').map(f => f.trim()).filter(Boolean)
  emit('submit', form.value)
}
</script>
