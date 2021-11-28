<template>
  <div>
    <v-flex md6
            offset-md3
            offset-sm3
            offset-xs1
            sm6
            xs10>
      <v-text-field label="Поиск анека по автору"
                    hide-details="auto"
                    placeholder="Введите ник автора"
                    :rules="searchRules"
                    v-model.trim="searchQuery"
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
                 :author="anek.author"
                 :body="anek.body"
                 :id="anek.id"
                 :key="anek.id"
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
  props: ['user'],
  data() {
    return {
      searchQuery: '',
      searchRules: [(v) => !v || v.length >= 3 || 'Запрос должен быть длиннее 3 символов'],
    };
  },
  components: { AnekCard, Spinner },
  computed: {
    ...mapGetters({ loading: 'loading', aneks: 'getSearchedAneks' }),
  },
  methods: {
    ...mapActions(['fetchSearchedAneks']),
  },
  created() {
    this.fetchSearchedAneks = debounce(this.fetchSearchedAneks, 400);
    if (this.$route.query?.user !== '') {
      this.searchQuery = this.$route.query.user;
    }
  },
  watch: {
    searchQuery() {
      if (this.searchQuery?.length >= 3) {
        this.fetchSearchedAneks(this.searchQuery);
        window.history.pushState(null, document.title, `${window.location.pathname}?user=${this.searchQuery}`);
      }
    },
  },
};
</script>