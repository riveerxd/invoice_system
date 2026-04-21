import app from '../main';
import { setActiveLang } from '@/filters/date.filter';

export default {
  namespaced: true,
  state: {
    lang: null,
    all: [
      { name: 'English', code: 'en' },
      { name: 'French', code: 'fr' },
      { name: 'Italian', code: 'it' },
      { name: 'Estonian', code: 'et' },
      { name: 'Persian', code: 'fa' },
      { name: 'Spanish', code: 'es' },
      { name: 'Bangla', code: 'bn' },
      { name: 'German', code: 'de' },
      { name: 'Português - BR', code: 'pt_br' },
      { name: 'Indonesian', code: 'id' },
      { name: 'Korean', code: 'kr' },
      { name: 'Czech', code: 'cs' },
    ],
  },
  mutations: {
    lang(state, lang) {
      state.lang = lang;
    },
  },
  actions: {
    changeLanguage({ commit }, lang) {
      app.$i18n.i18next.changeLanguage(lang.code);
      app.$router.push({ query: { ...app.$route.query, lang: lang.code } });
      setActiveLang(lang.code);
      commit('lang', lang);
    },
    initLanguage({ commit, state }, code) {
      const lang = state.all.find(l => l.code === code);
      setActiveLang(code);
      commit('lang', lang);
    },
  },
};
