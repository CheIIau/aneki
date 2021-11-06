async fetchAneks({ commit, getters }) {
    commit('setLoading', true);
    const resultAneks = [];
    try {
      const db = getDatabase();
      const aneksRef = ref(db, 'aneks');
      await Promise.resolve().then(() => {
        onValue(aneksRef, (snapshot) => {
          const aneks = snapshot.val();
          let i = 0;
          Object.keys(aneks).forEach((key) => {
            const anek = aneks[key];
            const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, key, anek.rating);
            Vue.set(resultAneks, i, newAnek);
            // if (!getters.getAneks.includes(newAnek)) {
            //   resultAneks.push(newAnek);
            // }
            ++i;
          });
          //Костыль, но при использовании метода push, при обновлении данных, элементы пушатся еще раз в конец массива
        });
      });
      // commit('setLoading', false);
      commit('loadAneks', resultAneks);
    } catch (error) {
      commit('setError', error.message);
      commit('setLoading', false);
      throw error;
    }
  },

  async fetchFavouriteAneks({ commit, getters }) {
    // commit('setLoading', true);
    const resultAneks = [];
    try {
      const db = getDatabase();
      const aneksRef = ref(db, 'aneks');
      const mostRatedAneksRef = query(aneksRef, orderByChild('rating'));
      let i = 0;
      await Promise.resolve().then(() => {
        onValue(mostRatedAneksRef, (snapshot) => {
          snapshot.forEach((child) => {
            const anek = child.val();
            const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, child.key, anek.rating);
            Vue.set(resultAneks, i, newAnek);
            ++i;
          });
        });
      });
      commit('loadAneks', resultAneks);
    } catch (error) {
      commit('setError', error.message);
      commit('setLoading', false);
      throw error;
    }
  },

  fetchAneksFromDB({ dispatch, commit }) {
    try {
      const db = getDatabase();
      const aneksRef = ref(db, 'aneks');
      dispatch('fetchAneks', aneksRef);
    } catch (error) {
      commit('setError', error.message);
      throw error;
    }
  },

  fetchFavouriteAneksFromDB({ dispatch, commit }) {
    try {
      const db = getDatabase();
      const aneksRef = ref(db, 'aneks');
      const mostRatedAneksRef = query(aneksRef, orderByChild('rating'));
      dispatch('fetchAneks', mostRatedAneksRef);
    } catch (error) {
      commit('setError', error.message);
      throw error;
    }
  },
