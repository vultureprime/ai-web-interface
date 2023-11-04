## OpenAI langchain basic RAG

RAG (Retrieval Augmented Generation) is an intelligent system that provides instant, accurate answers to common questions. It understands natural language and offers personalized guidance, making it a versatile tool for improving user experiences across various platforms, take a look at the following resources:

- [How to build rag with langchain](https://www.vultureprime.com/blogs/rag-internal-knowledge) - learn about build rag with langchain.
- [OpenAI langchain basic RAG](https://github.com/vultureprime/deploy-ai-model/tree/main/paperspace-example/openai-langchain-basic-RAG) - resources langchain basic RAG.

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

![interface.png](https://github.com/vultureprime/ai-web-interface/blob/main/next-openai-langchain-basic-RAG/image/interface.png)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Config

You can to edit your config path in config.ts

1. PATH_UPLOAD = `/loadAndStore`
2. PATH_QUERY_WITHOUT_RETRIEVAL = `/queryWithOutRetrieval`
3. PATH_QUERY_WITH_RETRIEVAL = `/queryWithRetrieval`

You can edit default state in config.ts

```bash
export const defaultValues = {
  chunk_size: 1024,
  chunk_overlap: 0,
  collection_name: 'temp1',
  url: 'https://lilianweng.github.io/posts/2023-06-23-agent',
  endpoint: '{{your end point}}',
}
```

## API LoadAndStore Interface

```bash
GET {endpoint}/loadAndStore
```

### Response 200 (OK)

```bash
{
  url:string //default = https://lilianweng.github.io/posts/2023-06-23-agent
  chunk_size:number //default = 1024
  chunk_overlap:number //default = 0
  collection_name:string //default = temp1
}
```

## API Query

```bash
POST {endpoint}/queryWithOutRetrieval
or
POST {endpoint}/queryWithRetrieval
```

### Body

```bash
{
  query: string
  collection_name:string
}
```

## Custom Handle

Custom onSubmit in index.tsx

```bash
  const onSubmit = async (data: IOpenAIForm) => {
    switch (step) {
      case State.endpointState:
        //set collection and endpoint
        //TODO Edit anything here

      case State.loadStoreState:
        //set load and store
        //TODO Edit anything here

      case State.chatState:
        //set up search query
        //TODO Edit anything here query chat
      default:
        break
    }
  }
```

## License

MIT

## Contributor

VulturePrime
