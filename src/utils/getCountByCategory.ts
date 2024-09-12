import _ from 'lodash'
import { dealLabel } from './dealLabel'

function getCountByCategory(posts) {
  let category: string[] = []
  const filteredPosts = posts.filter(({ data }) => {
    return import.meta.env.PROD ? !data.draft : true
  })
  filteredPosts.forEach((post) => {
    category = _.compact([...category, ..._.flattenDeep(dealLabel(post.data.category))])
  })
  const result = _.countBy(category)
  if (result.uncategorized) {
    const num = result.uncategorized
    delete result.uncategorized
    result.uncategorized = num
  }
  return result
}

export default getCountByCategory
