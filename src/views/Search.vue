<template>
  <div>
    <v-flex md6
            offset-md3
            offset-sm3
            offset-xs1
            sm6
            xs10>
      <v-text-field v-model.trim="searchQuery"
                    label="Поиск анека по автору"
                    hide-details="auto"
                    placeholder="Введите ник автора"
                    :rules="searchRules"
                    class="pb-9">
        <v-icon slot="prepend"
                color="primary">
          mdi-magnify
        </v-icon>
      </v-text-field>
    </v-flex>
    <v-flex v-if="!loading"
            md6
            offset-md3
            offset-sm3
            offset-xs1
            sm6
            xs10>
      <anek-card v-for="anek in aneks"
                 :id="anek.id"
                 :key="anek.id"
                 :author="anek.author"
                 :body="anek.body"
                 :rating="anek.rating"
                 :time="anek.time"
                 :title="anek.title"></anek-card>
    </v-flex>
    <spinner v-else></spinner>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';
import { debounce } from '@/functions/index.js';

export default {
  components: { AnekCard, Spinner },
  data() {
    return {
      searchQuery: '',
      searchRules: [(v) => !v || v.length >= 3 || 'Запрос должен быть длиннее 3 символов'],
    };
  },
  computed: {
    ...mapGetters({ loading: 'loading', aneks: 'getSearchedAneks' }),
  },
  watch: {
    searchQuery() {
      if (this.searchQuery?.length >= 3) {
        this.fetchSearchedAneks(this.searchQuery);
        window.history.pushState(null, document.title, `${window.location.pathname}?user=${this.searchQuery}`);
      }
    },
  },
  created() {
    this.fetchSearchedAneks = debounce(this.fetchSearchedAneks, 400);
    if (this.$route.query?.user !== '') {
      this.searchQuery = this.$route.query.user;
    }
  },
  methods: {
    ...mapActions(['fetchSearchedAneks']),
  },
};
</script>