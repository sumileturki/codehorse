import { pineconeIndex } from "@/lib/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    value: text,
  });

  // gemini-embedding-001 supports Matryoshka Representation Learning
  // so we can safely truncate the vector array down to 768 to match the Pinecone index
  return embedding.slice(0, 768);
}

export async function indexCodeBase(
  repoId: string,
  files: { path: string; content: string }[],
) {
  const vectors = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;

    const truncatedContent = content.slice(0, 8000);

    try {
      const embedding = await generateEmbedding(truncatedContent);

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          content: truncatedContent,
        },
      });
    } catch (error) {
      console.error(`Failed to embed file: ${file.path}`, error);
    }
  }

  if (vectors.length > 0) {
    const batchsize = 100;

    for (let i = 0; i < vectors.length; i += batchsize) {
      const batch = vectors.slice(i, i + batchsize);

      await pineconeIndex.upsert(batch);
    }
  }

  console.log("Indexing complete");
}

export async function retrieveContext(
  query: string,
  repoId: string,
  topK: number = 5,
) {
  const embedding = await generateEmbedding(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    filter: { repoId },
    topK,
    includeMetadata: true,
  });

  return results.matches
    .map((match) => match.metadata?.content as string)
    .filter(Boolean);
}
