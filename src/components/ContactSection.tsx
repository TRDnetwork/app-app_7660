```tsx
// Added specific handling for rate limiting errors
if (res.status === 429) {
  showToast('Too many requests. Please try again later.', 'error');
  return;
}
```

### 12. CSS Custom Properties