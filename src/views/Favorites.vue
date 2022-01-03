<template>
  <div>
    <v-flex md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading && bookmarkedAneksId.length !== 0"
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
    <v-container fluid
                 v-else-if="!loading && bookmarkedAneksId.length == 0">
      <v-layout justify-center>
        <v-flex fill-height
                md6
                sm8
                text-center
                xs12>
          <p class="text-h4 primary--text">У вас нет анеков в закладках</p>
        </v-flex>
      </v-layout>
    </v-container>
    <spinner v-else></spinner>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getDatabase, ref, get } from 'firebase/database';
import AnekCard from '@/components/AnekCard.vue';
import Spinner from '@/components/Spinner.vue';
import { Anek } from '@/classes/index.js';

export default {
  data() {
    return {
      aneks: [],
    };
  },
  methods: {
    ...mapActions(['setLoading', 'loadBookmarkedAneks']),
    async renderAneks() {
      const db = getDatabase();
      let i = 0;
      this.bookmarkedAneksId.forEach(async (anekId) => {
        const aneksRef = ref(db, 'aneks/' + anekId);
        await get(aneksRef).then((snapshot) => {
          const anek = snapshot.val();
          const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, anekId, anek.rating);
          this.$set(this.aneks, i, newAnek);
          ++i;
        });
      });
    },
  },
  computed: {
    ...mapGetters({ bookmarkedAneksId: 'getBookmarkedAneks', loading: 'loading' }),
  },
  components: {
    AnekCard,
    Spinner,
  },
  async created() {
    if (this.bookmarkedAneksId?.length !== 0) {
      await this.renderAneks();
      this.setLoading(false);
    } else {
      await this.loadBookmarkedAneks();
    }
  },
  watch: {
    async bookmarkedAneksId() {
      if (this.bookmarkedAneksId || this.bookmarkedAneksId.length !== 0) {
        this.aneks = [];
        await this.renderAneks();
        this.setLoading(false);
      }
    },
  },
};
</script>
