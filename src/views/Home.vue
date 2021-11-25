<template>
  <div>
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
    <div ref="observer"
         class="observer"></div>
  </div>

</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  data: () => ({
    items: [
      { title: 'Сначала новые', sort: 'new' },
      { title: 'Сначала старые', sort: 'old' },
    ],
    sort: 'new',
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
    ...mapMutations(['clearAneks']),
    sortAneks(sort) {
      this.sort = sort;
      this.clearAneks();
      if (sort === 'new') {
        this.newAneks();
      } else if (sort === 'old') {
        this.oldAneks();
      }
    },
  },
  async created() {
    this.clearAneks();
    await this.newAneks();
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
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.observer {
  height: 60px;
}
</style>
