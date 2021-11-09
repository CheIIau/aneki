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
            <v-btn class="hidden-sm-and-down"
                   color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on">
              Сортировать
            </v-btn>
            <v-btn class="hidden-md-and-up mb-3"
                   color="primary"
                   dark
                   v-bind="attrs"
                   block
                   v-on="on">
              Сортировать &nbsp;
              <v-icon>mdi-sort-ascending</v-icon>
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
    <template>
      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination v-model="page"
                              class="my-4"
                              :length="totalPages"
                              :total-visible="7"></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';

export default {
  data: () => ({
    page: 1,
    items: [
      { title: 'По рейтингу', sort: 'rating' },
      { title: 'Сначала новые', sort: 'new' },
      { title: 'Сначала старые', sort: 'old' },
    ],
  }),
  components: { AnekCard },
  computed: {
    ...mapGetters({
      aneks: 'getAneks',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
      aneksCount: 'getAneksCount',
    }),
    totalPages() {
      return Math.ceil(this.aneksCount / 3);
    },
  },
  methods: {
    ...mapActions({
      newAneks: 'fetchNewAneksFromDB',
      oldAneks: 'fetchOldAneksFromDB',
      ratedAneks: 'fetchFavouriteAneksFromDB',
      fetchAneksCount: 'fetchAneksCount',
    }),
    sortAneks(sort) {
      if (sort === 'new') {
        const lastAnekId = this.aneks[this.aneks.length - 1].id;
        this.newAneks({ pageNum: this.page, lastAnekId });
      } else if (sort === 'rating') {
        this.ratedAneks(this.page);
      } else if (sort === 'old') {
        this.oldAneks(this.page);
      }
    },
  },
  created() {
    // прописать в анеках в функции fetch если propPage != null передаем id в fetchAnek из fetchanekDb и сортируем. в fetchAnek прописать по умолчанию propPage = null
    this.newAneks();
    this.fetchAneksCount();
  },
  watch: {
    aneks() {
      if (this.aneks.length != 0) {
        this.$store.commit('setLoading', false);
      }
    },
    page() {
      console.log(123);
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
