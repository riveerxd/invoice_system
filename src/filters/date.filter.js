import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

let activeLang = 'en';
export function setActiveLang(lang) { activeLang = lang; }

export function formatDate(val, toFormat = 'D MMM YYYY', fromFormat = 'YYYY-MM-DDTHH:mm:ssZ') {
  if (val) {
    const format = activeLang === 'cs' ? 'D. M. YYYY' : toFormat;
    return dayjs(String(val), fromFormat).format(format);
  }
}
