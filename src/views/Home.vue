<template>
  <v-app>
    <v-flex md10
            offset-md1
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <div class="text-right">
        <span class="hidden-sm-and-down">&nbsp;</span>
        <v-menu offset-y
                transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="hidden-sm-and-down"
                   color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on">Сортировать</v-btn>
            <v-btn block
                   class="hidden-md-and-up mb-3"
                   color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on">
              Сортировать &nbsp;
              <v-icon>mdi-sort-ascending</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :key="index"
                         class="pointer"
                         v-for="(item, index) in items">
              <v-list-item-title @click="sortAneks(item.sort)">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-flex>

    <v-flex md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <anek-card :author="anek.author"
                 :body="anek.body"
                 :id="anek.id"
                 :key="anek.id"
                 :rating="anek.rating"
                 :time="anek.time"
                 :title="anek.title"
                 v-for="anek in aneks"></anek-card>
    </v-flex>
    <spinner v-else></spinner>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  data: () => ({
    items: [
      { title: 'Сначала новые', sort: 'new' },
      { title: 'Сначала старые', sort: 'old' },
    ],
  }),
  components: { AnekCard, Spinner },
  computed: {
    ...mapGetters({
      aneks: 'getAneks',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
    }),
  },
  methods: {
    ...mapActions({
      newAneks: 'fetchNewAneksFromDB',
      oldAneks: 'fetchOldAneksFromDB',
    }),
    sortAneks(sort) {
      if (sort === 'new') {
        const lastAnekId = this.aneks[this.aneks.length - 1].id;
        this.newAneks({ lastAnekId });
      } else if (sort === 'old') {
        this.oldAneks(this.page);
      }
    },
  },
  created() {
    this.newAneks();
    this.$store.commit('setLoading', false);
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
