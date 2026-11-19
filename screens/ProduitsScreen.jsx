// =====================================================================
// screens/ProduitsScreen.jsx  (TP Produits - version finale, parties 3 à 7)
// Liste des produits lue dans SQLite avec FlatList :
//   - 3 états : chargement / erreur / liste (vide ou non)
//   - tirer pour rafraîchir, bouton d'ajout
//   - recherche + filtre par catégorie (fait en SQL)
//   - pagination (LIMIT / OFFSET + onEndReached)
// =====================================================================
import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './ProduitsStyles';
import {
  initDb, listerProduits, compterProduits, listerCategories,
} from '../database';

// Nombre de produits lus à chaque page
const TAILLE_PAGE = 10;

// 9.9 -> "9,90 €"
const formaterPrix = (prix) => prix.toFixed(2).replace('.', ',') + ' €';

// Composant d'une ligne de la liste (défini HORS de l'écran)
const CarteProduit = ({ produit }) => (
  <View style={styles.carte}>
    <Image
      source={{ uri: produit.image_url }}
      style={styles.imageJeu}
      resizeMode="cover"
      accessibilityLabel={`Image de ${produit.nom}`}
    />
    <View style={styles.carteGauche}>
      <Text style={styles.nom}>{produit.nom}</Text>
      <Text style={styles.categorie}>{produit.categorie}</Text>
    </View>
    <View>
      <Text style={styles.prix}>{formaterPrix(produit.prix)}</Text>
      {/* Style conditionnel : rouge seulement si stock === 0 */}
      <Text style={styles.stock}>
        Sorti en {produit.annee}
      </Text>
    </View>
  </View>
);

// Défini hors du composant pour ne pas être recréé à chaque affichage
const Separateur = () => <View style={styles.separateur} />;

export const ProduitsScreen = ({ utilisateur, onDeconnexion }) => {
  // ----- États (useState) --------------------------------------------
  const [produits, setProduits] = useState([]);       // les lignes affichées
  const [categories, setCategories] = useState([]);   // [null, 'Informatique', ...]
  const [recherche, setRecherche] = useState('');     // texte saisi
  const [categorie, setCategorie] = useState(null);   // null = "Toutes"
  const [version, setVersion] = useState(0);          // compteur de rechargement
  const [chargement, setChargement] = useState(true); // 1er chargement (plein écran)
  const [rafraichissement, setRafraichissement] = useState(false); // tirer pour rafraîchir
  const [erreur, setErreur] = useState(null);
  const [total, setTotal] = useState(0);              // nb total (pour "10 / 25")
  const [chargementPlus, setChargementPlus] = useState(false); // page suivante en cours

  // useRef : valeur qui survit aux affichages SANS en provoquer.
  // Compte les rechargements pour savoir si une page reçue est périmée.
  const generation = useRef(0);

  // ----- Les catégories : lues une seule fois ([]) --------------------
  useEffect(() => {
    initDb()
      .then(listerCategories)
      .then((liste) => setCategories([null, ...liste])) // null en tête = "Toutes"
      .catch(console.log);
  }, []);

  // ----- Les produits : relus dès qu'une dépendance change -----------
  useEffect(() => {
    let actuel = true;        // passe à false si l'effet est relancé
    generation.current += 1;  // nouveau rechargement

    const lire = async () => {
      try {
        await initDb();
        // Promise.all : la page 1 et le total sont lus en même temps
        const [lignes, nombre] = await Promise.all([
          listerProduits({ recherche, categorie, limite: TAILLE_PAGE, decalage: 0 }),
          compterProduits({ recherche, categorie }),
        ]);
        if (actuel) {
          setProduits(lignes); // remplace la liste (on repart de la page 1)
          setTotal(nombre);
          setErreur(null);
        }
      } catch (e) {
        console.log(e);
        if (actuel) setErreur('Impossible de charger les produits');
      } finally {
        if (actuel) {
          setChargement(false);
          setRafraichissement(false);
        }
      }
    };

    lire();
    // Fonction de nettoyage : exécutée avant de relancer l'effet
    // et quand l'écran disparaît -> les réponses en retard sont ignorées
    return () => {
      actuel = false;
    };
  }, [recherche, categorie, version]);

  // ----- Actions -----------------------------------------------------
  // Changer "version" relance l'effet à filtres identiques
  const recharger = () => setVersion((v) => v + 1);

  const reessayer = () => {
    setChargement(true);
    recharger();
  };

  const rafraichir = () => {
    setRafraichissement(true);
    recharger();
  };

  // Appelée par onEndReached quand on approche de la fin de la liste
  const chargerPlus = async () => {
    // Garde-fous : lecture déjà en cours, ou tout est déjà chargé
    if (chargementPlus || produits.length >= total) return;

    const lecture = generation.current;
    setChargementPlus(true);
    try {
      const suite = await listerProduits({
        recherche, categorie, limite: TAILLE_PAGE, decalage: produits.length,
      });
      // Un rechargement a eu lieu pendant la lecture : cette page est périmée
      if (lecture !== generation.current) return;
      // On AJOUTE la page à la fin (nouveau tableau -> nouvel affichage)
      setProduits((actuels) => [...actuels, ...suite]);
    } catch (e) {
      console.log(e);
    } finally {
      setChargementPlus(false);
    }
  };

  // ----- Rendu : 3 retours possibles ---------------------------------
  if (chargement) {
    return (
      <SafeAreaView style={[styles.ecran, styles.centre]}>
        <ActivityIndicator size="large" color="#52A27A" />
      </SafeAreaView>
    );
  }

  if (erreur) {
    return (
      <SafeAreaView style={[styles.ecran, styles.centre]}>
        <Text style={styles.messageErreur}>{erreur}</Text>
        <Pressable
          onPress={reessayer}
          style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
        >
          <Text style={styles.boutonTexte}>Réessayer</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Un résultat vide n'a pas le même sens avec ou sans filtre
  const filtreActif = recherche.trim() !== '' || categorie !== null;

  return (
    <SafeAreaView style={styles.ecran}>
      {/* Partie fixe (ne défile pas) : titre, utilisateur, recherche */}
      <View style={styles.fixe}>
        <View style={styles.ligneTitre}>
          <View>
            <Text style={styles.titre}>Jeux vidéo</Text>
            <Text style={styles.sousTitre}>{produits.length} / {total} jeu(x)</Text>
          </View>
          <Pressable onPress={onDeconnexion}>
            <Text style={styles.lienDeconnexion}>Se déconnecter</Text>
          </Pressable>
        </View>
        <Text style={styles.bonjour}>Connecté : {utilisateur.prenom} {utilisateur.nom}</Text>
        <TextInput
          style={styles.champRecherche}
          placeholder="Rechercher un jeu"
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          value={recherche}
          onChangeText={setRecherche} // chaque frappe relance l'effet
        />
      </View>

      {/* FlatList HORIZONTALE des catégories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        extraData={categorie} // redessine les puces quand la catégorie change
        keyExtractor={(c) => c ?? 'toutes'}
        style={styles.listePuces}
        contentContainerStyle={styles.puces}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: c }) => (
          <Pressable
            onPress={() => setCategorie(c)}
            style={[styles.puce, categorie === c && styles.puceActive]}
          >
            <Text style={[styles.puceTexte, categorie === c && styles.puceTexteActive]}>
              {c ?? 'Toutes'}
            </Text>
          </Pressable>
        )}
      />

      {/* FlatList des produits */}
      <FlatList
        data={produits}
        keyExtractor={(item) => String(item.id)} // clé unique et stable : l'id SQL
        renderItem={({ item }) => <CarteProduit produit={item} />}
        ItemSeparatorComponent={Separateur}
        ListEmptyComponent={
          <Text style={styles.vide}>
            {filtreActif ? 'Aucun produit ne correspond' : 'Aucun produit à afficher'}
          </Text>
        }
        refreshing={rafraichissement}   // indicateur "tirer pour rafraîchir"
        onRefresh={rafraichir}
        onEndReached={chargerPlus}      // pagination
        onEndReachedThreshold={0.5}     // déclenche à un demi-écran de la fin
        ListFooterComponent={
          chargementPlus ? <ActivityIndicator style={styles.pied} color="#52A27A" /> : null
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.liste}
      />
    </SafeAreaView>
  );
};
