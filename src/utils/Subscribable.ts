export class Subscribable<T> {
    private callbacks: Set<(data: T) => void>;
    private subscribableData: () => T;

    constructor(subscribableDataGetter: () => T) {
        this.subscribableData = subscribableDataGetter;
        this.callbacks = new Set<(data: T) => void>();
    }

    public subscribe(callback: (data: T) => void): void {
        this.callbacks.add(callback);
        callback(this.subscribableData());
    }

    public unsubscribe(callback: (data: T) => void): void {
        this.callbacks.delete(callback);
    }

    public notify(): void {
        const newData = this.subscribableData();
        this.callbacks.forEach((callback) => {
            callback(newData);
        });
    }
}