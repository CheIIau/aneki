<template>
  <v-app>
    <v-flex v-if="!loading"
            xs10
            offset-xs1
            sm8
            offset-sm2
            md10
            offset-md1>
      <div class="text-right">
        <v-menu offset-y
                transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on">
              Сортировать
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="pointer"
                         v-for="(item, index) in items"
                         :key="index">
              <v-list-item-title @click="sortAneks(item.sort)">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-flex>

    <v-flex v-if="!loading"
            xs10
            offset-xs1
            sm8
            offset-sm2
            md6
            offset-md3>
      <anek-card v-for="anek in aneks"
                 :key="anek.id"
                 :title="anek.title"
                 :body="anek.body"
                 :time="anek.time"
                 :author="anek.author"
                 :id="anek.id"
                 :rating="anek.rating"></anek-card>
    </v-flex>
    <div v-else>
      <v-container grid-list-xs>
        <v-flex d-flex
                justify-center
                xs-12
                class="pt-9 mt-9">
          <v-progress-circular :size="100"
                               :width="4"
                               color="primary"
                               indeterminate></v-progress-circular>
        </v-flex>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';

export default {
  data: () => ({
    items: [
      { title: 'Сначала новые', sort: 'new' },
      { title: 'По рейтингу', sort: 'rating' },
    ],
  }),
  components: { AnekCard },
  computed: {
    ...mapGetters({ aneks: 'getAneks', loading: 'loading', isUserLoggedIn: 'isUserLoggedIn' }),
  },
  methods: {
    sortAneks(sort) {
      if (sort === 'new') {
        this.$store.dispatch('fetchAneksFromDB');
      } else if (sort === 'rating') {
        this.$store.dispatch('fetchFavouriteAneksFromDB');
      }
    },
  },
  created() {
    this.$store.dispatch('fetchAneksFromDB');
    // this.$store.dispatch('fetchFavouriteAneksFromDB');
  },
  watch: {
    aneks() {
      if (this.aneks.length != 0) {
        this.$store.commit('setLoading', false);
      }
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
