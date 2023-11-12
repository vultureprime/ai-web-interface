export const PATH_QUERY_WITH_RETRIEVAL = '/queryWithRetrieval'
export const PATH_QUERY_WITHOUT_RETRIEVAL = '/queryWithOutRetrieval'
export const PATH_UPLOAD = '/loadAndStore'

export const defaultValues = {
  chunk_size: 1024,
  chunk_overlap: 0,
  collection_name: 'temp1',
  url: 'https://lilianweng.github.io/posts/2023-06-23-agent',
  endpoint: '',
}

export const stepInfo = [
  {
    title: 'Enter Endpoint API or API Key',
    desc: 'Begin by inputting the Endpoint API or API Key you wish to connect with.',
    icon: 'carbon:api',
  },
  {
    title: 'Set up collection and load in store',
    desc: 'Proceed to upload a PDF document in the desired format.',
    icon: 'carbon:cloud-upload',
  },
  {
    title: ' Engage in Chat with Openai Langchain Basic RAG',
    desc: 'Initiate a chat session with the Openai Langchain Basic RAG to seek guidance or relevant information.',
    icon: 'ph:question',
  },
]
