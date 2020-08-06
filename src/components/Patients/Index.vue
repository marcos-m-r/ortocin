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
              ref="patiengDialog"
              :patient="editingPatient"
              :patients="patients"
              :editing="editing"
              @add:patient="addPatient"
              @edit:patient="editPatient"
              @set:editing-patient="setEditingPatient"
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
            <v-alert v-if="success" type="success">{{ successMessage }}</v-alert>
            <v-alert v-if="error" type="error">{{ errorMessage }}</v-alert>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editMode(item)">mdi-pencil</v-icon>
              <v-icon small @click="deletePatient(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="success" color="success" :timeout="7500" elevation="3" top right>
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="success = false">Fechar</v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="error" color="error" :timeout="7500" elevation="3" top right>
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="error = false">Fechar</v-btn>
      </template>
    </v-snackbar>
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
      success: false,
      successMessage: "",
      error: false,
      errorMessage: "",
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

      let errorMessage = "Não foi possível buscar os pacientes 😞";

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (response.ok) {
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
        } else {
          this.errorMessage = errorMessage;
          this.error = true;
        }

        this.loading = false;
      } catch (error) {
        this.loading = false;

        this.errorMessage = errorMessage;
        this.error = true;
      }
    },

    clickRow(row) {
      console.log(row);
    },

    editMode(patient) {
      this.editingPatient = Object.assign({}, patient);
      this.editing = true;

      this.$refs.patiengDialog.editing = true;
      this.$refs.patiengDialog.show();
    },

    addPatient(patient) {
      this.editing = true;
      this.editPatient = patient;
      this.patients = [...this.patients, patient];
    },

    editPatient(id, data) {
      this.patients = this.patients.map((patient) =>
        patient.id === id ? data : patient
      );
    },

    setEditingPatient(patient) {
      this.editingPatient = Object.assign({}, patient);
    },

    async deletePatient(id) {
      let errorMessage = "Não foi possível remover o paciente 😞";

      this.loading = true;
      try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: "DELETE",
        });

        this.patients = this.patients.filter((patient) => patient.id !== id);
        this.loading = false;

        this.successMessage = "O usuário foi removido com sucesso 😁";
        this.success = true;
      } catch (error) {
        console.error(error);
        this.loading = false;

        this.errorMessage = errorMessage;
        this.error = true;
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