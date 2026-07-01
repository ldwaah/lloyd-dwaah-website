# Lloyd Dwaah — local development

## One platform (merged)

**`Lloyd website`** and **`Lloyd website-new`** are the same project. Everything lives in **`Lloyd website`** only.

| Folder | Status |
|--------|--------|
| **`Lloyd website`** | **Active — edit, build, deploy from here** |
| `Lloyd website-new` | **Mirror / backup** — do not edit; kept in sync automatically |
| `Lloyd website-default` | Frozen reference. Ignore. |

## Run locally

```bash
cd "/Users/lloyddwaah/Lloyd website"
npm run dev
```

Open **http://localhost:5175**

| Page | URL |
|------|-----|
| Home | http://localhost:5175/ |
| Experience | http://localhost:5175/experience.html |
| Ventures | http://localhost:5175/ventures.html |
| Publications | http://localhost:5175/publications.html |

## Build & deploy

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist --site=c26bc9d5-6831-4073-ae22-507aedf411fa
```

## For Claude / other agents

Always use **`/Users/lloyddwaah/Lloyd website`**. Never edit `Lloyd website-new` or `Lloyd website-default`.
