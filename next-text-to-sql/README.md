## Text to SQL

- [How to build text to sql with llamaindex and athena](https://www.vultureprime.com/how-to/how-to-build-text-to-sql-with-llamaindex-and-athena) - learn about text to sql.

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

![interface.png](https://github.com/vultureprime/ai-web-interface/blob/main/next-text-to-sql/image/interface.png)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Config

You can edit api in .env

```bash
  NEXT_PUBLIC_API = your endpoint
```

## Custom Handle

Custom onSubmit in index.tsx

```bash
  const onSubmit = async (data: IOpenAIForm) => {
    //TODO edit here
    addToAnswers('user', data.query)
    const result = await queryPromt({ query_str: data.query })
    if (result) {
      setValue('query', '')
      return addToAnswers(
        'ai',
        result.data?.result as string,
        result.data?.['SQL Query'] as string
      )
    }
  }

```

## License

MIT

## Contributor

VulturePrime
