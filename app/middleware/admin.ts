export default defineNuxtRouteMiddleware(async () => {
  const profile = useProfile()
  await profile.fetch()
  if (!['admin'].includes(profile.role.value)) {
    return navigateTo('/')
  }
})
