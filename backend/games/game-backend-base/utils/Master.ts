
export default function Master(target: Object, propertyKey: string, descriptor: any) {
    let originalMethod = descriptor.value
    descriptor.value = function () {
        if (this.master === arguments[1].id) {
            let result = originalMethod.apply(this, arguments)
            return result
        }
    }
    return descriptor
}