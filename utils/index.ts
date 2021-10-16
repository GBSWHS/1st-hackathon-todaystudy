import { decode } from 'html-entities'

export function htmlToString (returnText: string) {
  // -- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br>/gi, '\n')
  returnText = returnText.replace(/<br\s\/>/gi, '\n')
  returnText = returnText.replace(/<br\/>/gi, '\n')

  // //-- remove P and A tags but preserve what's inside of them
  returnText = returnText.replace(/<p.*>/gi, '\n')
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, ' $2 ($1)')

  // //-- remove all inside SCRIPT and STYLE tags
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, '')
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, '')

  // //-- remove all else
  returnText = returnText.replace(/<(?:.|\s)*?>/g, '')

  // //-- get rid of more than 2 multiple line breaks:
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, '\n\n')

  // -- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g, '')

  returnText = returnText.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  returnText = decode(returnText)

  return returnText
}
