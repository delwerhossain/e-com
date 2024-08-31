import { Tcategory } from "./categories.interface"
import { categoryModel } from "./categories.model"

const createCategory = async (category: Tcategory) => {
    const result = await categoryModel.create(category)
    return result
}



export const categoryServices = {
    createCategory,
}