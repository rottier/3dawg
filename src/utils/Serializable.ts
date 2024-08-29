/**
 * Map to keep track of serializable/deserializable properties for each class,
 * along with custom keys to be used during (de)serialization.
 */
const serializablePropsMap = new WeakMap<any, Map<string, string>>();

/**
 * @Serializable decorator to mark a property for (de)serialization with an optional custom key.
 * @param customKey - The key to use during (de)serialization. If not provided, the property name will be used.
 */
export function Serializable(customKey?: string) {
    return function (target: any, context: ClassFieldDecoratorContext<any, any>) {
        const propertyKey = context.name || context;

        if (typeof propertyKey !== 'string' && typeof propertyKey !== 'symbol') {
            throw new Error("The property key must be a string or symbol");
        }

        const effectiveKey = customKey || String(propertyKey);
        let serializableProps = serializablePropsMap.get(target?.constructor);

        if (!serializableProps) {
            serializableProps = new Map<string, string>();
            serializablePropsMap.set(target?.constructor, serializableProps);
        }

        serializableProps.set(String(propertyKey), effectiveKey);
    };
}

/**
 * Serializes an object to a JSON string, using custom keys if specified.
 * @param obj - The object to serialize.
 * @returns A JSON string representing the serialized object.
 */
export function serialize(obj: any): string {
    const jsonObj: any = {};
    const serializableProps = serializablePropsMap.get(obj?.constructor);

    if (serializableProps) {
        for (const [propertyKey, customKey] of serializableProps) {
            jsonObj[customKey] = obj[propertyKey];
        }
    }

    return JSON.stringify(jsonObj);
}

/**
 * Deserializes a JSON string into an object, using custom keys if specified.
 * @param clazz - The class to instantiate.
 * @param jsonString - The JSON string to deserialize.
 * @returns An instance of the class populated with data from the JSON string.
 */
export function deserialize<T>(clazz: new () => T, jsonString: string): T {
    const obj = new clazz();
    const jsonObj = JSON.parse(jsonString);
    const serializableProps = serializablePropsMap.get(clazz);

    if (serializableProps) {
        for (const [propertyKey, customKey] of serializableProps) {
            if (jsonObj.hasOwnProperty(customKey)) {
                (obj as any)[propertyKey] = jsonObj[customKey];
            }
        }
    }

    return obj;
}
