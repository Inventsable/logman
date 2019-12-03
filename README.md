# Inventsable/logman

```bash
# install
npm install @Inventsable/logman

# usage
log
```

Logman prompts for any input, then updates a daily changelog kept in `./.logger/[DATE].md`. On adding any new lines, logman will reassemble a master changelog kept at `./CHANGELOG.md` with the results chronologically sorted.

## Example output:

```md
### 12.02.19

- **[05:41PM]** Did some more work just afterward
- **[05:40PM]** Did something at this time and date
```

### 12.02.19

- **[05:41PM]** Did some more work just afterward
- **[05:40PM]** Did something at this time and date
