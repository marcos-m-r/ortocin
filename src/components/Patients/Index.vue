<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title>
            <span>Pacientes</span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>

            <patient-dialog
              :patient="editingPatient"
              :patients="patients"
              @push:patient="pushPatient"
            />
          </v-card-title>
          <v-data-table
            class="elevation-1"
            :headers="headers"
            :items="patients"
            :search="search"
            :loading="loading"
            loading-text="Buscando os pacientes..."
            @dblclick:row="clickRow"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editMode(item)">mdi-pencil</v-icon>
              <v-icon small @click="deletePatient(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PatientDialog from "@/components/Patients/PatientDialog.vue";

export default {
  name: "patients-index",
  components: {
    PatientDialog,
  },
  data() {
    return {
      patients: [],
      search: "",
      loading: false,
      editing: false,
      editingPatient: {},
      patientObj: {
        id: null,
        name: "",
        cpf: "",
        birth: "",
        phone: "",
        appointed_by: "",
      },
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "name" },
        { text: "CPF", value: "cpf" },
        { text: "Nascimento", value: "birth" },
        { text: "Telefone", value: "phone" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.editingPatient = Object.assign({}, this.patientObj);

    this.$emit("update:pageTitle", "Pacientes");
    this.getPatients();
  },
  methods: {
    async getPatients() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();

        for (var key in data) {
          this.patients = [
            ...this.patients,
            {
              id: data[key].id,
              name: data[key].name,
              cpf: "000.000.000-00",
              birth: "05/07/1992",
              phone: data[key].phone,
              appointed_by: "",
            },
          ];
        }

        this.loading = false;
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },

    clickRow(row) {
      console.log(row);
    },

    editMode(patient) {
      this.editingPatient = Object.assign({}, patient);
      this.editing = true;

      this.dialog = true;
    },

    pushPatient(patient) {
      this.patients = [...this.patients, patient];
    },

    async deletePatient(patient) {
      console.log();
      try {
        await fetch(
          `https://jsonplaceholder.typicode.com/users/${patient.id}`,
          {
            method: "DELETE",
          }
        );

        this.patients = this.patients.filter(
          (patient) => patient.id !== patient.id
        );
      } catch (error) {
        console.error(error);
      }
    },

    closeDialog() {
      this.success = false;
      this.successMessage = "";

      this.error = false;
      this.errorMessage = "";

      this.editingPatient = Object.assign({}, this.patientObj);
      this.editing = false;
      console.log(this.editingPatient);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.patient-icon-text {
  padding-left: 5px;
}

.headline {
  color: #ba68c8 !important;
}
</style>