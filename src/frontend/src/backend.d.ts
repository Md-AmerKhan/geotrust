import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    id: bigint;
    url: string;
    title: string;
    source: string;
    publishedAt: string;
    description: string;
    imageUrl: string;
}
export interface backendInterface {
    getLastFetchedAt(): Promise<bigint>;
    getLatestArticles(): Promise<Array<Article>>;
    searchArticles(term: string): Promise<Array<Article>>;
    setApiKey(key: string): Promise<void>;
}
