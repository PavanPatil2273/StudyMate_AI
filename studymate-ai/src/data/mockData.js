export const mockDocuments = [
  { id: 1, name: 'Big_Data.pdf', size: '2.4 MB' },
  { id: 2, name: 'NLP.pdf', size: '1.8 MB' },
  { id: 3, name: 'DBMS.pdf', size: '3.1 MB' },
  { id: 4, name: 'FastAPI.pdf', size: '1.5 MB' },
]

export const mockResponses = {
  'what is mapreduce?': {
    text: `MapReduce is a programming model used to process large amounts of data.\n\nIt mainly consists of two stages:\n\n1. Map\n2. Reduce\n\nThe Map stage processes the input data, while the Reduce stage combines the results.`,
    sources: [
      { file: 'Big_Data.pdf', page: 12, snippet: 'MapReduce is a programming model used to process large datasets across clustered machines.' },
    ],
  },
  'explain the 5 vs of big data': {
    text: `The 5 V's of Big Data are Volume, Velocity, Variety, Veracity, and Value.\n\nVolume means large data size. Velocity means the speed of data generation. Variety means different data types. Veracity means data quality and trustworthiness. Value means the useful insight extracted from the data.`,
    sources: [
      { file: 'Big_Data.pdf', page: 18, snippet: 'The 5 V framework helps define the challenges and opportunities in big data analytics.' },
    ],
  },
  'what is olap?': {
    text: `OLAP stands for Online Analytical Processing. It is used to perform complex queries and data analysis across large datasets.\n\nIt is commonly used in business intelligence tools to summarize data by dimensions such as time, product, and region.`,
    sources: [
      { file: 'DBMS.pdf', page: 26, snippet: 'OLAP systems are optimized for multidimensional analysis and rapid reporting.' },
    ],
  },
  'what is hadoop?': {
    text: `Hadoop is an open-source framework used for storing and processing large datasets across multiple computers.\n\nIt is designed to scale out across clusters and handle big data workloads efficiently.`,
    sources: [
      { file: 'Big_Data.pdf', page: 8, snippet: 'Hadoop distributes storage and computation across multiple nodes for scalable analysis.' },
    ],
  },
  'what is natural language processing?': {
    text: `Natural Language Processing, or NLP, is a field of AI focused on helping computers understand and generate human language.\n\nIt is used in sentiment analysis, text classification, chatbots, and translation systems.`,
    sources: [
      { file: 'NLP.pdf', page: 5, snippet: 'NLP combines linguistics and machine learning to interpret human language.' },
    ],
  },
  'what is a primary key?': {
    text: `A primary key is a unique identifier for each record in a database table.\n\nIt ensures that no two rows have the same identity and helps maintain data integrity.`,
    sources: [
      { file: 'DBMS.pdf', page: 14, snippet: 'Primary keys are essential for identifying records and enforcing uniqueness.' },
    ],
  },
}

export const emptyPromptSuggestions = [
  'What is MapReduce?',
  'Explain the 5 Vs of Big Data',
  'What is OLAP?',
]
