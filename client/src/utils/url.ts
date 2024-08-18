import slugify from 'slugify'

export function getSafeUrlParams(params: string) {
  return slugify(params, {
    replacement: '_',
    lower: true,
    trim: true,
  })
}
