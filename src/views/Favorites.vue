<template>
  <v-app>
    <template>
      <v-flex v-if="!loading && aneksId.length!==0"
              xs10
              offset-xs1
              sm8
              offset-sm2
              md6
              offset-md3>
        <anek-card :aneks="aneks"></anek-card>
      </v-flex>
      <v-container fluid
                   v-else-if="!loading && aneksId.length==0">
        <v-layout justify-center>
          <v-flex xs12
                  sm8
                  md6
                  text-center
                  fill-height>
            <p class="text-h4 primary--text">У вас нет анеков в закладках</p>
          </v-flex>
        </v-layout>
      </v-container>
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
    </template>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AnekCard from '@/components/AnekCard.vue';
import { getDatabase, ref, get } from 'firebase/database';
import Anek from '@/classes/AnekClass';

export default {
  data() {
    return {
      aneks: [],
    };
  },
  methods: {
    ...mapActions(['setLoading', 'loadBookmarkedAneks']),
    renderAneks() {
      const db = getDatabase();
      let i = 0;
      this.aneksId.forEach((anekId) => {
        const aneksRef = ref(db, 'aneks/' + anekId);
        get(aneksRef).then((snapshot) => {
          const anek = snapshot.val();
          const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, anekId, anek.rating);
          this.$set(this.aneks, i, newAnek);
          ++i;
        });
      });
    },
  },
  computed: {
    ...mapGetters({ aneksId: 'getBookmarkedAneks', loading: 'loading' }),
    isAneksInBookmark() {
      return 123;
    },
  },
  components: {
    AnekCard,
  },
  created() {
    this.loadBookmarkedAneks();
    if (this.aneksId.length != 0) {
      this.renderAneks();
      this.setLoading(false);
    }
  },
  watch: {
    aneksId() {
      if (this.aneksId || this.aneksId.length != 0) {
        this.aneks = [];
        this.renderAneks();
        this.setLoading(false);
      }
    },
  },
};
</script>
