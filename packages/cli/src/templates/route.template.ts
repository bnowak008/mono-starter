// @ts-expect-error - This is expected to be in the existing project if using this template
import { router } from '../lib/trpc'
// @ts-expect-error - This is a generated file
import { __pascalName__Controller } from '../controllers/__camelName__Controller'

export const __camelName__Router = router({
  get: __pascalName__Controller.get,
  create: __pascalName__Controller.create,
  update: __pascalName__Controller.update,
  delete: __pascalName__Controller.delete,
}); 
