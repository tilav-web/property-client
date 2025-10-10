export interface IRegion {
    _id: string,
    name: string,
    location: {
        type: string,
        coordinates: [number, number]
    },
    code: string
}