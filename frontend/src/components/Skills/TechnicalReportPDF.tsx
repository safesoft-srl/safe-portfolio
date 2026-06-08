import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff' },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  table: { display: 'flex', flexDirection: 'column', width: '100%' },
  headerRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 10, fontWeight: 'bold', fontSize: 12 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 10, fontSize: 11 },
  col1: { width: '40%' },
  col2: { width: '30%' },
  col3: { width: '30%' }
});

interface Skill {
  name: string;
  category: string;
  is_active: boolean;
}

export const TechnicalReportPDF = ({ skills }: { skills: Skill[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Habilidades Técnicas</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.col1}>Nombre</Text>
          <Text style={styles.col2}>Categoría</Text>
          <Text style={styles.col3}>Estado</Text>
        </View>
        {skills.map((s, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.col1}>{s.name}</Text>
            <Text style={styles.col2}>{s.category}</Text>
            <Text style={styles.col3}>{s.is_active ? 'Activa' : 'Desactivada'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);