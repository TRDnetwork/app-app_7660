```ts
// Added input length limits to prevent abuse
if (trimmedName.length > 100 || trimmedEmail.length > 254 || trimmedMessage.length > 2000) {
  return res.status(400).json({ error: 'Input too long' });
}
```

### 9. Missing Type Definitions