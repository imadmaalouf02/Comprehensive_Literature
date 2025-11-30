# Development Guide

## Making Changes to the Application

### Adding a New Component

1. Create component file in `components/`
2. Import and use in `app/page.tsx` or other components
3. Add proper TypeScript types
4. Use Tailwind CSS classes with semantic design tokens

### Customizing the LLM Prompt

Edit the `system_prompt` in `scripts/literature_review_service.py` to modify:
- Number of articles generated
- Article metadata fields
- Synthesis section structure
- Response format

### Changing the API Model

Update `self.model` in `LiteratureReviewGenerator` class:
\`\`\`python
self.model = "openai/gpt-4-turbo"  # Change from gpt-4o-mini
\`\`\`

Available models via OpenRouter: https://openrouter.ai/docs/models

### Adding Dark Mode Variants

Update CSS variables in `app/globals.css`:
\`\`\`css
:root {
  /* Light mode colors */
}

.dark {
  /* Dark mode colors */
}
\`\`\`

### Extending Article Fields

1. Add field to `Article` dataclass in Python
2. Update type definition in React
3. Add UI display in `article-results.tsx`
4. Update API route response interface

## Testing

### Manual Testing

1. Start dev server: `npm run dev`
2. Enter test queries in the UI
3. Check browser console for errors
4. Verify Python process output in server logs

### Common Test Queries

- "Vision transformers for medical imaging"
- "Federated learning privacy"
- "Large language model optimization"
- "Neural architecture search"

## Debugging

### Enable Debug Logs

Add `console.log("[v0] ...")` statements in:
- React components for frontend issues
- API route for request/response issues
- Python service for backend issues

### Check Process Logs

\`\`\`bash
# View Next.js server logs
npm run dev

# View Python process stderr
# Check browser DevTools > Network tab
\`\`\`

## Performance Tips

1. Memoize expensive components with React.memo
2. Use SWR for efficient data fetching
3. Optimize images and assets
4. Monitor bundle size with `npm run build`

## Code Style

- Use TypeScript for type safety
- Follow Tailwind naming conventions
- Use semantic HTML elements
- Add comments for complex logic
- Keep components focused and single-responsibility
