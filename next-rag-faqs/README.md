## RAG Q&A Document

RAG (Retrieval Augmented Generation) is an intelligent system that provides instant, accurate answers to common questions. It understands natural language and offers personalized guidance, making it a versatile tool for improving user experiences across various platforms, take a look at the following resources:

- [RAG Concept](https://www.vultureprime.com/blogs/rag-internal-knowledge) - learn about RAG concept.
- [RAG Q&A Document Backend](https://github.com/vultureprime/deploy-ai-model/tree/main/paperspace-example/openai-langchain-basic-RAG) - learn about how to build RAG Q&A Document.

## Installation

```
https://github.com/vultureprime/ai-web-interface.git
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

![interface.png](https://github.com/vultureprime/ai-web-interface/blob/main/next-rag-faqs/image/interface.png)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Config

You can to edit your config path in config.ts

1. Path session
2. Path upload
3. Path ask

## API Session Interface

```bash
GET {endpoint}/session
```

### Response 200 (OK)

```bash
{uuid:'string'}
```

## API Upload Interface

```bash
POST {endpoint}/uploadpdf
```

### Body

```bash
{
  uuid: string
  file:(binary)
}
```

## API Ask Interface

```bash
POST {endpoint}/ask
```

### Body

```bash
{
  uuid: string
  message: string
}
```

## Custom Handle

1. Custom set session in index.tsx

```bash
  const handleSession = async () => {
   //TO DO anything here
  }
```

2. Custom upload file in index.tsx

```bash
  const handleUpload = async (e: any) => {
      //TO DO anything here
  }
```

3. Custom ask question in ChatWidget.tsx

```bash
  const handleAsk = async (e: any) => {
       //TO DO anything here
  }
```

## License

MIT

## Contributor

VulturePrime
