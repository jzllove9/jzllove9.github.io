import dayjs from 'dayjs'

export function sortPostsByDate(posts) {
  return posts
    .filter(({ data }) => {
      return import.meta.env.PROD ? !data.draft : true
    })
    .sort((a, b) => dayjs(b.data.date).unix() - dayjs(a.data.date).unix())
}
