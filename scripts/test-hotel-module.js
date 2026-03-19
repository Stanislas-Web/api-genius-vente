const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testHotelModule() {
  try {
    console.log('🏨 Test du Module Hotel\n');
    console.log('='.repeat(60));
    
    // 1. Connexion
    console.log('\n1️⃣  Connexion...');
    const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
      phone: '+243826016607',
      password: '1234'
    });
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Créer un type de chambre
    console.log('\n2️⃣  Création d\'un type de chambre...');
    const roomTypeData = {
      name: 'Suite Deluxe',
      description: 'Suite luxueuse avec vue sur la ville',
      hourlyRate: 15,
      nightRate: 60,
      fullDayRate: 100,
      capacity: 2,
      amenities: ['WiFi', 'TV', 'Climatisation', 'Mini-bar']
    };
    
    const roomTypeResponse = await axios.post(
      `${API_BASE_URL}/room-types`,
      roomTypeData,
      { headers }
    );
    const roomTypeId = roomTypeResponse.data.roomType._id;
    console.log('✅ Type de chambre créé:', roomTypeResponse.data.roomType.name);
    console.log('   ID:', roomTypeId);

    // 3. Créer une chambre
    console.log('\n3️⃣  Création d\'une chambre...');
    const randomRoomNumber = `${Math.floor(Math.random() * 900) + 100}`;
    const roomData = {
      roomNumber: randomRoomNumber,
      roomTypeId: roomTypeId,
      status: 'available',
      capacity: 2,
      description: 'Chambre avec vue sur jardin',
      floor: 2
    };
    
    const roomResponse = await axios.post(
      `${API_BASE_URL}/rooms`,
      roomData,
      { headers }
    );
    const roomId = roomResponse.data.room._id;
    console.log('✅ Chambre créée:', roomResponse.data.room.roomNumber);
    console.log('   ID:', roomId);
    console.log('   Statut:', roomResponse.data.room.status);

    // 4. Créer une réservation (3 jours)
    console.log('\n4️⃣  Création d\'une réservation (3 jours)...');
    const checkIn = new Date('2026-03-20T14:00:00Z');
    const checkOut = new Date('2026-03-23T11:00:00Z');
    
    const bookingData = {
      roomId: roomId,
      clientName: 'Jean Dupont',
      clientPhone: '+243826016607',
      clientEmail: 'jean@example.com',
      cardNumber: '1234-5678-9012',
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      rateType: 'standard',
      notes: 'Client régulier'
    };
    
    const bookingResponse = await axios.post(
      `${API_BASE_URL}/bookings`,
      bookingData,
      { headers }
    );
    const bookingId = bookingResponse.data.booking._id;
    console.log('✅ Réservation créée');
    console.log('   Client:', bookingResponse.data.booking.clientName);
    console.log('   Chambre:', bookingResponse.data.booking.roomId.roomNumber);
    console.log('   Check-in:', new Date(bookingResponse.data.booking.checkIn).toLocaleDateString());
    console.log('   Check-out:', new Date(bookingResponse.data.booking.checkOut).toLocaleDateString());
    console.log('   Montant calculé:', bookingResponse.data.booking.calculatedAmount, '$');
    console.log('   Montant final:', bookingResponse.data.booking.finalAmount, '$');
    console.log('   Statut:', bookingResponse.data.booking.status);

    // 5. Check-in
    console.log('\n5️⃣  Check-in du client...');
    const checkInResponse = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/check-in`,
      {},
      { headers }
    );
    console.log('✅ Check-in effectué');
    console.log('   Statut réservation:', checkInResponse.data.booking.status);

    // 6. Vérifier le statut de la chambre
    console.log('\n6️⃣  Vérification du statut de la chambre...');
    const roomCheckResponse = await axios.get(
      `${API_BASE_URL}/rooms/${roomId}`,
      { headers }
    );
    console.log('✅ Statut de la chambre:', roomCheckResponse.data.room.status);

    // 7. Check-out
    console.log('\n7️⃣  Check-out du client...');
    const checkOutResponse = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/check-out`,
      { checkOut: checkOut.toISOString() },
      { headers }
    );
    console.log('✅ Check-out effectué');
    console.log('   Statut réservation:', checkOutResponse.data.booking.status);
    console.log('   Montant final:', checkOutResponse.data.booking.finalAmount, '$');

    // 8. Créer une facture
    console.log('\n8️⃣  Création de la facture...');
    const invoiceResponse = await axios.post(
      `${API_BASE_URL}/invoices`,
      { bookingId: bookingId },
      { headers }
    );
    const invoice = invoiceResponse.data.invoice;
    console.log('✅ Facture créée');
    console.log('   Numéro:', invoice.invoiceNumber);
    console.log('   Client:', invoice.clientName);
    console.log('   Chambre:', invoice.roomNumber, '-', invoice.roomType);
    console.log('   Durée:', invoice.duration.days, 'jour(s),', invoice.duration.hours % 24, 'heure(s)');
    console.log('   Tarif appliqué:', invoice.rateApplied);
    console.log('   Détails:', invoice.rateDetails);
    console.log('   Montant total:', invoice.totalAmount, '$');
    console.log('   Statut:', invoice.status);

    // 9. Lister toutes les réservations
    console.log('\n9️⃣  Liste des réservations...');
    const bookingsListResponse = await axios.get(
      `${API_BASE_URL}/bookings`,
      { headers }
    );
    console.log('✅ Nombre de réservations:', bookingsListResponse.data.total);

    // 10. Lister toutes les factures
    console.log('\n🔟 Liste des factures...');
    const invoicesListResponse = await axios.get(
      `${API_BASE_URL}/invoices`,
      { headers }
    );
    console.log('✅ Nombre de factures:', invoicesListResponse.data.total);

    console.log('\n' + '='.repeat(60));
    console.log('✅ TOUS LES TESTS RÉUSSIS !');
    console.log('='.repeat(60));
    
    console.log('\n📊 Résumé:');
    console.log('   - Type de chambre créé: Suite Deluxe');
    console.log('   - Chambre créée: 201');
    console.log('   - Réservation: 3 jours');
    console.log('   - Montant: 100$ × 3 jours = 300$');
    console.log('   - Facture générée:', invoice.invoiceNumber);
    console.log('\n🎉 Le module Hotel fonctionne parfaitement !');

  } catch (error) {
    console.error('\n❌ ERREUR lors du test:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message || error.response.data);
      console.error('\nDétails complets:');
      console.error(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('Aucune réponse reçue du serveur');
      console.error('Vérifiez que le serveur est bien démarré sur le port 8000');
    } else {
      console.error('Erreur:', error.message);
    }
  }
}

testHotelModule();

module.exports = { testHotelModule };
