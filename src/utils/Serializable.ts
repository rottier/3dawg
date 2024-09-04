import { Denormalizer, Normalizer, Serializer } from "@paddls/ts-serializer";

export const defaultSerializer = () => new Serializer(new Normalizer(), new Denormalizer());