export const langController = (req, res, next) => {
  const { lang } = req.params

  res.cookie('nodepop-lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 20 }) // 20 days

  res.redirect('back')
}
