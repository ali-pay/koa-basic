import KoaRouter from '@koa/router'
import koaJwt from '@middleware/koa-jwt'
import { create_dict_list, delete_dict_list, remove_dict_list, search_dict_list, search_dict_list_tree, search_dict_list_tree_by_children, search_dict_list_tree_by_parent, update_dict_list } from './service'

export const router = new KoaRouter({ prefix: '/dict_list' })

router.post('/search_dict_list', search_dict_list)

router.post('/create_dict_list', koaJwt(['*']), create_dict_list)

router.post('/update_dict_list', koaJwt(['*']), update_dict_list)

router.post('/delete_dict_list', koaJwt(['*']), delete_dict_list)

router.post('/remove_dict_list', koaJwt(['*']), remove_dict_list)

router.post('/search_dict_list_tree', search_dict_list_tree)

router.post('/search_dict_list_tree_by_parent', search_dict_list_tree_by_parent)

router.post('/search_dict_list_tree_by_children', search_dict_list_tree_by_children)
