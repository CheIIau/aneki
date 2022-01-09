<template>
  <div>
    <v-flex v-if="!loading"
            md10
            offset-md1
            offset-sm2
            offset-xs1
            sm8
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
                   v-on="on">
              Сортировать
            </v-btn>
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
            <v-list-item v-for="(item, index) in items"
                         :key="index"
                         class="pointer">
              <v-list-item-title @click="sortAneks(item.sort)">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-flex>

    <v-flex v-if="!loading"
            md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            xs10
            class="anek-content">
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
    <div ref="observer"
         class="observer"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  components: { AnekCard, Spinner },
  data: () => ({
    items: [
      { title: 'Сначала новые', sort: 'new' },
      { title: 'Сначала старые', sort: 'old' },
    ],
    sort: 'new',
  }),

  computed: {
    ...mapGetters({
      aneks: 'getAneks',
      loading: 'loading',
      isUserLoggedIn: 'isUserLoggedIn',
      getBookmarkedAneks: 'getBookmarkedAneks',
    }),
  },

  watch: {
    loading() {
      if (this.aneks.length !== 0) {
        this.setLoading(false);
      }
    },
  },

  async created() {
    this.clearAneks();
    await this.newAneks();
    if (this.getBookmarkedAneks?.length === 0) {
      await this.loadBookmarkedAneks();
    }
  },

  async mounted() {
    this.startObserving();
  },
  
  methods: {
    ...mapActions({
      newAneks: 'fetchNewAneksFromDB',
      oldAneks: 'fetchOldAneksFromDB',
      loadBookmarkedAneks: 'loadBookmarkedAneks',
    }),
    ...mapMutations(['clearAneks', 'setLoading']),
    sortAneks(sort) {
      this.sort = sort;
      this.clearAneks();
      if (sort === 'new') {
        this.newAneks();
      } else if (sort === 'old') {
        this.oldAneks();
      }
    },

    startObserving() {
      const optionsObserver = {
        rootMargin: '0px',
        threshold: 1.0,
      };
      const callbackObserver = (entries) => {
        if (entries[0].isIntersecting && this.aneks.length !== 0) {
          const lastAnek = this.aneks.at(-1);
          if (this.sort === 'new') {
            this.newAneks({ lastAnekVal: lastAnek.reverseTime });
          } else if (this.sort === 'old') {
            this.oldAneks({ lastAnekVal: lastAnek.time });
          }
        }
      };
      const observer = new IntersectionObserver(callbackObserver, optionsObserver);
      observer.observe(this.$refs.observer);
    },
  },
};
</script>

<style scoped>
.observer {
  height: 60px;
}
.anek-content {
  margin-top: -30px;
}
@media all and (max-width: 960px) {
  .anek-content {
    margin-top: 0px;
  }
}
</style>
