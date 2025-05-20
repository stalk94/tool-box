import { DataTable } from '@lib/index';
import { Column } from 'primereact/column';
import styled, { css } from 'styled-components';
import React from 'react';

export function DataTableWrap() {
    const data = [
        { sex: 'm', login: 'White black', email: 'stalk9424@gmail.com' },
        {
            sex: 'fem',
            login: 'Ekaterina Rinaldi',
            email: 'kristinkas666@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Kristina Sergeevna',
            email: 'kristina.sergeevna252022@gmail.com'
        },
        { sex: 'm', login: 'Кузин Сергей', email: 'kuzin.ss.1488@gmail.com' },
        { sex: 'm', login: 'Saeed Khan', email: 'opkhan9988777@gmail.com' },
        {
            sex: 'fem',
            login: 'Nirob Ahmed',
            email: 'nirobahmed62626@gmail.com'
        },
        {
            sex: 'm',
            login: 'Олександр Іванов',
            email: 'zhenia.grunuov@gmail.com'
        },
        {
            sex: 'fem',
            login: '8AT0N41K undefined',
            email: 'betboom148@gmail.com'
        },
        {
            sex: 'm',
            login: 'Archana Meena',
            email: 'archanameena767@gmail.com'
        },
        {
            sex: 'm',
            login: 'peter alfonso',
            email: 'peteralfon12345@gmail.com'
        },
        {
            sex: 'm',
            login: 'Brazil Free fire',
            email: 'brazilfreefire4652@gmail.com'
        },
        { sex: 'fem', login: 'Coni Gamer', email: 'conigamer201@gmail.com' },
        {
            sex: 'm',
            login: 'diaz undefined',
            email: 'thiagoemmanueldiaz@gmail.com'
        },
        { sex: 'm', login: 'Messi Leonel', email: 'leonelpepsi023@gmail.com' },
        {
            sex: 'fem',
            login: 'alejo stancampiano',
            email: 'alejostancampiano4@gmail.com'
        },
        {
            sex: 'm',
            login: 'Arturo Reinoso',
            email: 'arturoreinosos@gmail.com'
        },
        { sex: 'm', login: 'Neck Shet', email: 'neckshet82@gmail.com' },
        { sex: 'm', login: 'alam semesta', email: 'alamsemesta1290@gmail.com' },
        { sex: 'm', login: 'Aliyu Saeed', email: 'aliyusaidu291@gmail.com' },
        {
            sex: 'm',
            login: 'Gaston Zorrilla',
            email: 'gastonreyna15@gmail.com'
        },
        { sex: 'm', login: 'Xlr8 undefined', email: 'xlr8caca@gmail.com' },
        { sex: 'm', login: 'Musawir Khan', email: 'mairajmalook8@gmail.com' },
        {
            sex: 'fem',
            login: 'Dylan sebastian Villalba acuña',
            email: 'villalbaacunadylansebastian@gmail.com'
        },
        {
            sex: 'm',
            login: 'benjamin chialvo',
            email: 'benjaminchialvo923@gmail.com'
        },
        { sex: 'm', login: 'Rin undefined', email: 'thelordryder05@gmail.com' },
        { sex: 'm', login: 'el morta', email: 'elmorta738@gmail.com' },
        {
            sex: 'm',
            login: 'Ezequiel Sarmiento',
            email: 'ezequiel.de.la.matanza.22@gmail.com'
        },
        { sex: 'm', login: 'Buri Mondal', email: 'mburi360@gmail.com' },
        {
            sex: 'm',
            login: 'Santino undefined',
            email: 'santinosanto211@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Edwin Atswenje amalemba',
            email: 'atswenjeamalembaedwin@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Sergio Ruiz diaz',
            email: 'ruizdiaz.david3826@gmail.com'
        },
        {
            sex: 'fem',
            login: 'MD Raihan Hossin',
            email: 'mdraihanh996@gmail.com'
        },
        { sex: 'm', login: 'Darle Carz', email: 'darlecarz@gmail.com' },
        { sex: 'm', login: 'Luciano Rosi', email: 'rosiluciano30@gmail.com' },
        { sex: 'm', login: 'Ivan Gonzalez', email: 'ivang07081996@gmail.com' },
        {
            sex: 'm',
            login: 'Владислав Бугайченко',
            email: 'bugajcenkov1@gmail.com'
        },
        { sex: 'fem', login: 'Den Ogo', email: 'ogorodnikden111@gmail.com' },
        {
            sex: 'm',
            login: 'Diego Castro',
            email: 'diegocastronico15@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Maximo Troncoso',
            email: 'maxtroncoso1959@gmail.com'
        },
        {
            sex: 'm',
            login: 'Gian Franco Wiest',
            email: 'gianf.wiest@gmail.com'
        },
        {
            sex: 'm',
            login: 'Martin Waispek',
            email: 'martinwaispek973@gmail.com'
        },
        { sex: 'fem', login: 'Chino Fdz', email: 'chinofdz8@gmail.com' },
        { sex: 'm', login: 'Axel Yañez', email: 'yaxel2738@gmail.com' },
        { sex: 'fem', login: 'Axel Massin', email: 'axelmassin971@gmail.com' },
        { sex: 'm', login: 'Thiago Morel', email: 'morelthiago623@gmail.com' },
        { sex: 'fem', login: 'riko tampati', email: 'rikot968@gmail.com' },
        { sex: 'm', login: 'Far DN', email: 'fardn00@gmail.com' },
        { sex: 'fem', login: 'lhcen lhcen', email: 'lhcenl755@gmail.com' },
        { sex: 'm', login: 'Oufi Adam', email: 'adamoufi74@gmail.com' },
        { sex: 'm', login: 'Kalkal Madoh', email: 'kalkalmadoh@gmail.com' },
        { sex: 'fem', login: 'Khan Jan', email: 'kj903648@gmail.com' },
        { sex: 'm', login: 'Ahmed Djamed', email: 'djamedahmed17@gmail.com' },
        {
            sex: 'fem',
            login: 'Cristian Barraza',
            email: 'barrazacristian2000@gmail.com'
        },
        {
            sex: 'm',
            login: 'Javi undefined',
            email: 'javimilei881737@gmail.com'
        },
        { sex: 'fem', login: 'Fahmi Royhan', email: 'fahmiroyhan13@gmail.com' },
        {
            sex: 'm',
            login: 'Agustin Rodríguez',
            email: 'aguskiller0@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Andrè Miranda',
            email: 'andrelipsque14@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Ismael Leguizamon',
            email: 'ismaelleguizamon1999@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Lucas Pereyra',
            email: 'lucas7xxxtentacion@gmail.com'
        },
        { sex: 'm', login: 'Ahmad Tawhid', email: 'ahmadtawhid09@gmail.com' },
        { sex: 'm', login: 'Jose Rotela', email: 'joseedurotela78@gmail.com' },
        { sex: 'fem', login: 'mohd hamza', email: 'mohdhamza69265@gmail.com' },
        {
            sex: 'm',
            login: 'Hukum ini Rimba',
            email: 'hukuminirimba@gmail.com'
        },
        { sex: 'm', login: 'Vazgec Aga', email: 'vazgecaga@gmail.com' },
        { sex: 'm', login: 'Jose Martinez', email: 'nombredenerf@gmail.com' },
        {
            sex: 'm',
            login: 'Nddjjdrj undefined',
            email: 'aptroamazeng@gmail.com'
        },
        {
            sex: 'm',
            login: 'Francisco Toledo',
            email: 'toledofrancisco848@gmail.com'
        },
        {
            sex: 'm',
            login: 'Souhyl Merhrour',
            email: 'souhylmerhrour@gmail.com'
        },
        { sex: 'm', login: 'curu lpds', email: 'curulpds43@gmail.com' },
        { sex: 'm', login: 'Erik Gank', email: 'erikgank4@gmail.com' },
        {
            sex: 'fem',
            login: 'Mario undefined',
            email: 'mariavictoriasesa81@gmail.com'
        },
        { sex: 'fem', login: 'Whis Qieoa', email: 'qieoawhis@gmail.com' },
        {
            sex: 'm',
            login: 'Sanjay kushwah army lover',
            email: 'sanjaykushwah30500@gmail.com'
        },
        { sex: 'fem', login: 'Anas Jr', email: 'aj9549297@gmail.com' },
        {
            sex: 'm',
            login: 'ceboll manzana',
            email: 'cebollmanzana11@gmail.com'
        },
        { sex: 'm', login: 'Sami Serdar', email: 'samiishaqzada123@gmail.com' },
        { sex: 'm', login: 'Lolo Lala', email: 'klallekarita@gmail.com' },
        { sex: 'm', login: 'Da Wolf', email: 'dawolflol5@gmail.com' },
        { sex: 'fem', login: 'Fauzan Syuja', email: 'fauzansyuja25@gmail.com' },
        { sex: 'm', login: 'Lisandro Roda', email: 'rodalisandro13@gmail.com' },
        { sex: 'm', login: 'Mac 44 2', email: 'mac767763@gmail.com' },
        {
            sex: 'fem',
            login: 'vicky mishra',
            email: 'vickymishra6201@gmail.com'
        },
        { sex: 'fem', login: 'Usman Marral', email: 'wwwanjum29@gmail.com' },
        { sex: 'fem', login: 'Owais Shah', email: 'owaisshahon2@gmail.com' },
        {
            sex: 'm',
            login: 'Benjamin Chialvo',
            email: 'benjachialvo13@gmail.com'
        },
        { sex: 'm', login: 'marina elinor', email: 'maricsir96@gmail.com' },
        {
            sex: 'fem',
            login: 'Joko Prasetyo undefined',
            email: 'j7550569@gmail.com'
        },
        {
            sex: 'm',
            login: 'Maximo Leguizamon',
            email: 'maximoleguizamon031@gmail.com'
        },
        { sex: 'm', login: 'Kursi Oren', email: 'kursioren754@gmail.com' },
        { sex: 'm', login: 'Renzo Melinao', email: 'melinaorenzo@gmail.com' },
        { sex: 'm', login: 'Thiago Gaido', email: 'tito09.ok@gmail.com' },
        {
            sex: 'fem',
            login: 'Alan andres Pires',
            email: 'alanandrespires9@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Arun Prajapati',
            email: 'prajapatiarun709@gmail.com'
        },
        { sex: 'fem', login: 'Azucena Moreno', email: 'azu26moreno@gmail.com' },
        {
            sex: 'fem',
            login: 'Ángel Castillo',
            email: 'angelcompado12356@gmail.com'
        },
        {
            sex: 'm',
            login: 'Ramiro Rodriguez',
            email: 'ramirodriguez25112009@gmail.com'
        },
        { sex: 'm', login: 'Gamer Kumar', email: 'gamerkumar303@gmail.com' },
        {
            sex: 'm',
            login: 'Diego Estrapajo',
            email: 'diegoestrapajo@gmail.com'
        },
        {
            sex: 'm',
            login: 'Jonathan Tvbox',
            email: 'tvboxjonathan137@gmail.com'
        },
        {
            sex: 'm',
            login: 'Nicolas Giménez',
            email: 'arrongimenez0091@gmail.com'
        },
        {
            sex: 'm',
            login: 'Domingo Alfonso',
            email: 'domingoalfonso958@gmail.com'
        },
        {
            sex: 'm',
            login: 'goku kakaroto',
            email: 'superchayashin800@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Jonas Yanguez',
            email: 'jonasyanguez24@gmail.com'
        },
        { sex: 'm', login: 'Alan Alegre', email: 'alegre651111@gmail.com' },
        {
            sex: 'fem',
            login: 'leviatán657 ;v',
            email: 'leviatan657rodri@gmail.com'
        },
        {
            sex: 'm',
            login: 'juannn velasquez',
            email: 'juannnvelasquez@gmail.com'
        },
        { sex: 'm', login: 'ryn cbd', email: 'ryncbd@gmail.com' },
        { sex: 'm', login: 'Bauti Ala', email: 'alabauti600@gmail.com' },
        {
            sex: 'fem',
            login: 'Nicolas Giménez',
            email: 'noyagimenezg12345@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Oscarcito undefined',
            email: 'victoriamanca123@gmail.com'
        },
        {
            sex: 'fem',
            login: 'nacho Iglesias',
            email: 'nacho.iglesias2007@gmail.com'
        },
        { sex: 'm', login: 'ramiro undefined', email: 'extrauso064@gmail.com' },
        {
            sex: 'fem',
            login: 'Mateo Corrales',
            email: 'corralesmateo2007@gmail.com'
        },
        { sex: 'm', login: 'Samir Patar', email: 'patars858@gmail.com' },
        {
            sex: 'm',
            login: 'francisco papaleta',
            email: 'franciscopapaleta@gmail.com'
        },
        { sex: 'm', login: 'Mng Guevara', email: 'mngguevara057@gmail.com' },
        { sex: 'm', login: 'Rocio Lencina', email: 'rociou1516@gmail.com' },
        { sex: 'm', login: 'Emre İkizpınar', email: 'eikizpinar@gmail.com' },
        { sex: 'm', login: 'P. Selvam', email: 'selvam97667092@gmail.com' },
        { sex: 'fem', login: 'Santi Mattos', email: 'santi007212@gmail.com' },
        { sex: 'm', login: 'Feud xxx', email: 'elfeud@gmail.com' },
        {
            sex: 'm',
            login: 'Alejandro Villalba',
            email: 'villalbaalejandro150@gmail.com'
        },
        { sex: 'fem', login: 'Haroon Alvi', email: 'haroonalvi878@gmail.com' },
        { sex: 'fem', login: 'Hkiri Aziz', email: 'hkiriaziz111@gmail.com' },
        { sex: 'fem', login: 'Jose Osinaga', email: 'joseosinaga67@gmail.com' },
        {
            sex: 'fem',
            login: 'Lisandro Marquez',
            email: 'lisandromarquez216@gmail.com'
        },
        { sex: 'fem', login: 'Vikash Tiwari', email: 'vt633885@gmail.com' },
        { sex: 'fem', login: 'Dabo Rofik', email: 'daborofik992@gmail.com' },
        {
            sex: 'fem',
            login: 'Joaquin Arevalo',
            email: 'joaquinarevalo2009@gmail.com'
        },
        {
            sex: 'm',
            login: 'Antonio Vera',
            email: 'antoniodomingovera4@gmail.com'
        },
        { sex: 'm', login: 'mike undefined', email: 'mikeke200404@gmail.com' },
        { sex: 'm', login: 'Camikrac 92', email: 'camikrac26@gmail.com' },
        { sex: 'fem', login: 'Nelida Alvarez', email: 'betyalv745@gmail.com' },
        {
            sex: 'fem',
            login: 'Elias Alarcon',
            email: 'alarconelias007@gmail.com'
        },
        {
            sex: 'fem',
            login: 'maria julieta sestili',
            email: 'mariajulietasestili@gmail.com'
        },
        {
            sex: 'm',
            login: 'Joshuaa Shaukat',
            email: 'joshuaashaukat96@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Hernan Alejandro Caceres',
            email: 'hernanalejandrocaceres7@gmail.com'
        },
        {
            sex: 'm',
            login: 'Daniel Alvez',
            email: 'daniel2025alvezz@gmail.com'
        },
        {
            sex: 'm',
            login: 'Nico Delmazzo',
            email: 'delmazzonicolas@gmail.com'
        },
        { sex: 'm', login: 'mateo iwnl120', email: 'paradamateo76@gmail.com' },
        { sex: 'm', login: 'Martin Price', email: 'martinprice127@gmail.com' },
        {
            sex: 'm',
            login: 'federico fredes',
            email: 'federicofredes049@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Jonathan Cruz',
            email: 'jonathanjesuscruz.50@gmail.com'
        },
        {
            sex: 'm',
            login: 'Isidro Lozano',
            email: 'isidrolozano405@gmail.com'
        },
        {
            sex: 'm',
            login: 'Elías ezequiel Ayala',
            email: 'eliasezequielayala0@gmail.com'
        },
        {
            sex: 'm',
            login: 'Rodrigo Leon',
            email: 'leonrondrigo.2020@gmail.com'
        },
        {
            sex: 'm',
            login: 'ezequiel velaquez',
            email: 'eze.elknayask8r.21@gmail.com'
        },
        { sex: 'fem', login: 'Brando Leon', email: 'leonbrando200@gmail.com' },
        {
            sex: 'm',
            login: 'Aure undefined',
            email: 'aureyosoyfande@gmail.com'
        },
        { sex: 'fem', login: 'Ada Nuñez', email: 'hermosamabelada@gmail.com' },
        { sex: 'm', login: 'Bauti undefined', email: 'bautiurielf@gmail.com' },
        {
            sex: 'fem',
            login: 'FRANCO OMAR PICON',
            email: 'piconfrancoomar@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Agustin Caceres',
            email: 'caceresagustin1275@gmail.com'
        },
        { sex: 'fem', login: 'Alan Cejas', email: 'alancejas359@gmail.com' },
        {
            sex: 'fem',
            login: 'nico95 chiavarelli',
            email: 'chiavarellinico@gmail.com'
        },
        {
            sex: 'm',
            login: 'Raj Gupta Gupta',
            email: 'rajguptagupta076@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Marcelo Carezzano',
            email: 'detailsucacha@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Matias Nahuel',
            email: 'jerenahuel321@gmail.com'
        },
        { sex: 'm', login: 'A. Quintana', email: 'quintanaa491@gmail.com' },
        {
            sex: 'm',
            login: 'Agustin Tolaba',
            email: 'agustintolaba060@gmail.com'
        },
        { sex: 'm', login: 'Bruno Leiva', email: 'brunoleiva336@gmail.com' },
        { sex: 'm', login: 'Lopez Nico', email: 'lnico7868@gmail.com' },
        {
            sex: 'm',
            login: 'franco aguirre',
            email: 'francotomasaguirre@gmail.com'
        },
        {
            sex: 'm',
            login: 'Eugenio Amato',
            email: 'eugenioamato772@gmail.com'
        },
        { sex: 'm', login: 'Iwiwnw undefined', email: 'iwiwnw340@gmail.com' },
        { sex: 'm', login: 'Ezequiel Perez', email: 'ezeperez262@gmail.com' },
        { sex: 'fem', login: 'Cesar Arevalo', email: 'cesararevao4@gmail.com' },
        {
            sex: 'm',
            login: 'Maximo Bareiro',
            email: 'maximobareiro2@gmail.com'
        },
        { sex: 'm', login: 'خالد جيسي', email: 'brwdkshnk@gmail.com' },
        { sex: 'fem', login: 'Tomi Baez', email: 'tomibaez7890@gmail.com' },
        {
            sex: 'fem',
            login: 'Dario Redondo',
            email: 'redondodario17@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Jorge luis duran bermudez',
            email: 'jorgeluisduranbermudez@gmail.com'
        },
        { sex: 'm', login: 'Diego Cifarelli', email: 'dcifarelli5@gmail.com' },
        {
            sex: 'm',
            login: 'nicolas gimenez',
            email: 'nicolasgimenez212@gmail.com'
        },
        { sex: 'm', login: 'Gaspi Watch', email: 'gaspardellepiane@gmail.com' },
        {
            sex: 'm',
            login: 'nahuel villalba',
            email: 'nahuelvillalba105@gmail.com'
        },
        {
            sex: 'm',
            login: 'Ezequieldavid Aranda',
            email: 'ezequieldavidaranda6@gmail.com'
        },
        {
            sex: 'm',
            login: 'Lautaro Nahuel Nicolas',
            email: 'lautaronahuelnicolas@gmail.com'
        },
        { sex: 'm', login: 'Rajan Kumar', email: 'rajankumarpepsi@gmail.com' },
        {
            sex: 'm',
            login: 'tomas alvertini',
            email: 'alvertinitomas@gmail.com'
        },
        { sex: 'm', login: 'Video Chat', email: 'onlinechat123g@gmail.com' },
        {
            sex: 'fem',
            login: 'Bsksv Sbsnvsbs',
            email: 'mertcelik5212@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Raman Kumar',
            email: 'ramanpoonia1990@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Devrim Ali Ünal',
            email: 'devrimaliunal03@gmail.com'
        },
        { sex: 'm', login: 'Wild Esmid', email: 'esmidwild@gmail.com' },
        {
            sex: 'm',
            login: 'Esteban Vallejos',
            email: 'esteban.vallejos.carp@gmail.com'
        },
        {
            sex: 'fem',
            login: 'behzad ranani',
            email: 'ranani.behzad@gmail.com'
        },
        { sex: 'fem', login: 'Yustin Aredes', email: 'aredesyustin@gmail.com' },
        {
            sex: 'm',
            login: 'Ignacio Peralta',
            email: 'peraltaignacio933@gmail.com'
        },
        {
            sex: 'm',
            login: 'Charly Encina',
            email: 'charlyencina309@gmail.com'
        },
        {
            sex: 'm',
            login: 'brandon undefined',
            email: 'quirogabrandon2006@gmail.com'
        },
        { sex: 'fem', login: 'Pepi To', email: 'pepit614@gmail.com' },
        {
            sex: 'm',
            login: 'Alexis Andrada',
            email: 'andradaalexis814@gmail.com'
        },
        {
            sex: 'm',
            login: 'Matias Monta Bie',
            email: 'matiasmontabie1@gmail.com'
        },
        { sex: 'fem', login: 'Ome Tv', email: 'ometv3721@gmail.com' },
        {
            sex: 'fem',
            login: 'gonzalo maldonado',
            email: 'maldonadogonzalo969@gmail.com'
        },
        { sex: 'm', login: 'Gabriel Osuna', email: 'gosuna403@gmail.com' },
        {
            sex: 'fem',
            login: 'Bautista undefined',
            email: 'b9356506@gmail.com'
        },
        { sex: 'm', login: 'Toto undefined', email: 'totoreynoso25@gmail.com' },
        {
            sex: 'm',
            login: 'Jeremias Zalazar',
            email: 'jeremiaszalazar793@gmail.com'
        },
        { sex: 'm', login: 'Atres Whis', email: 'atreswhis@gmail.com' },
        {
            sex: 'fem',
            login: 'yoryipintura y restauraciones Di Lella',
            email: 'jorgedilella@gmail.com'
        },
        { sex: 'fem', login: 'Ezequiel Vedia', email: 'vedia4436@gmail.com' },
        {
            sex: 'm',
            login: 'Gonzalo Rodriguez',
            email: 'gonzaarodriguez2001@gmail.com'
        },
        { sex: 'm', login: 'Lucas Farhat', email: 'lucasfarhat353@gmail.com' },
        { sex: 'm', login: 'Nico Gamer', email: 'nico94878@gmail.com' },
        {
            sex: 'fem',
            login: 'Mauro undefined',
            email: 'rollmauro84@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Martin Sosa',
            email: 'martinsosajose1959@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Alvaro Narvaez',
            email: 'alvarogta756@gmail.com'
        },
        {
            sex: 'fem',
            login: 'lollito undefined',
            email: 'lollito259@gmail.com'
        },
        { sex: 'fem', login: 'khan afridi', email: 'ka4586569@gmail.com' },
        { sex: 'm', login: 'Gucci Prada', email: 'gucciprada876@gmail.com' },
        {
            sex: 'fem',
            login: 'Brandon Montenegro',
            email: 'brandonmontenegro155@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Rebeca OF modelo',
            email: 'ofmodelorebeca@gmail.com'
        },
        { sex: 'fem', login: 'Santy Chafa', email: 'chafasanty@gmail.com' },
        {
            sex: 'fem',
            login: 'Gonzalo Gonzalez',
            email: 'gonzlogonzalez1234@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Walter Adrián Cardozo',
            email: 'walteradriancardozo8@gmail.com'
        },
        { sex: 'm', login: 'Matias Reinaga', email: 'matireinaga2d@gmail.com' },
        {
            sex: 'm',
            login: 'Hawtin Ricardo',
            email: 'hawtinricardo2@gmail.com'
        },
        {
            sex: 'm',
            login: 'Tomas Cicchetti',
            email: 'cicchettitomas@gmail.com'
        },
        {
            sex: 'm',
            login: 'Alejandro martin Romero',
            email: 'alejandromartinromero3@gmail.com'
        },
        { sex: 'm', login: 'Lucia Mendoz', email: 'mendozlucia71@gmail.com' },
        {
            sex: 'fem',
            login: 'Junior Chaparro',
            email: 'chaparrojunior217@gmail.com'
        },
        { sex: 'm', login: 'Cesar Leiva', email: '4cesarleiva@gmail.com' },
        { sex: 'm', login: 'Kalim isi', email: 'kalimisi21@gmail.com' },
        {
            sex: 'm',
            login: 'Luciano Prieto',
            email: 'prietoluciano247@gmail.com'
        },
        {
            sex: 'm',
            login: 'Gonzalo Espinoza',
            email: 'gonzaaespiinozaa@gmail.com'
        },
        {
            sex: 'm',
            login: 'Sebastian Ruiz Diaz',
            email: 'sebasssh716@gmail.com'
        },
        { sex: 'm', login: 'KA Yusuf', email: 'kosimadiyusuf93@gmail.com' },
        {
            sex: 'm',
            login: 'Alex undefined',
            email: 'cuentaalbiononline26@gmail.com'
        },
        { sex: 'm', login: 'Ahter Germ', email: 'yarrakusyan@gmail.com' },
        {
            sex: 'fem',
            login: 'Veronica Illarraga',
            email: 'veronicaillarraga34@gmail.com'
        },
        { sex: 'm', login: 'Maximo Soria', email: 'maxi221436@gmail.com' },
        {
            sex: 'fem',
            login: 'Julio Ventancour',
            email: 'juventancour@gmail.com'
        },
        { sex: 'm', login: 'Angel Monzon', email: 'monzonangel932@gmail.com' },
        { sex: 'm', login: 'Luis Jesus', email: 'lj4978539@gmail.com' },
        {
            sex: 'm',
            login: 'Juaco Viscarra',
            email: 'juacoviscarra3@gmail.com'
        },
        {
            sex: 'm',
            login: 'Benjamin Gonzalez',
            email: 'benjitasz56@gmail.com'
        },
        {
            sex: 'm',
            login: 'Arinal Hidayat',
            email: 'arinalhidayat9@gmail.com'
        },
        {
            sex: 'm',
            login: 'Emiliano javier Coria',
            email: 'emilianojaviercoria@gmail.com'
        },
        {
            sex: 'm',
            login: 'Roman Gomez',
            email: 'romanjosuegomez19462@gmail.com'
        },
        {
            sex: 'm',
            login: 'nico undefined',
            email: 'nicolasgaleanozx@gmail.com'
        },
        { sex: 'm', login: 'Mauri Brandan', email: 'mauribrandan1@gmail.com' },
        { sex: 'm', login: 'Minoria J', email: 'minoria2345@gmail.com' },
        {
            sex: 'm',
            login: 'Gaspar Retamal',
            email: 'gasparretamal618@gmail.com'
        },
        { sex: 'm', login: 'احمد احمد', email: 'abdl6m66@gmail.com' },
        {
            sex: 'm',
            login: 'Benja Bobadilla',
            email: 'benjabobadilla813@gmail.com'
        },
        { sex: 'm', login: 'Tony Tony', email: 'tonyxxtonyxx00@gmail.com' },
        {
            sex: 'm',
            login: 'Isaias hernan Riquelme',
            email: 'isaiashernanr@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Mateo Sanchez',
            email: 'mateitodemama5@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Евгения Мозолюк',
            email: 'mozoluk.evgenia@gmail.com'
        },
        { sex: 'm', login: 'Luis Roberto Gomez', email: 'roberlg9@gmail.com' },
        { sex: 'm', login: 'Ramón Alcantara', email: 'ramoncinalca@gmail.com' },
        { sex: 'fem', login: 'Lucas Esmaiz', email: 'esmaizlucas@gmail.com' },
        { sex: 'm', login: 'hakim M', email: 'hakim.m.13700@gmail.com' },
        {
            sex: 'm',
            login: 'Fjsntdkt Hrurzist',
            email: 'hrurzistfjsntdkt@gmail.com'
        },
        { sex: 'm', login: 'Benja Sanchez', email: 'benjajas2450@gmail.com' },
        {
            sex: 'm',
            login: 'Felix Gimenez',
            email: 'felixgimenez2986@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Julian Mendez',
            email: 'julimendezloia@gmail.com'
        },
        { sex: 'm', login: 'Ezexx __', email: 'vvalentinogaeta@gmail.com' },
        { sex: 'm', login: 'Fabian Rosso', email: 'rossofabian7@gmail.com' },
        {
            sex: 'm',
            login: 'Gregorio Dalessandro',
            email: 'gregoriodalessandro148@gmail.com'
        },
        { sex: 'fem', login: 'Elian Gaitan', email: 'eliangaitan08@gmail.com' },
        {
            sex: 'm',
            login: 'Tomas undefined',
            email: 'tomischnell20@gmail.com'
        },
        { sex: 'm', login: 'At Loppo', email: 'loppoat3@gmail.com' },
        {
            sex: 'm',
            login: 'Meencantachuparvaginas undefined',
            email: 'meencantachuparvaginas@gmail.com'
        },
        {
            sex: 'm',
            login: 'Robert Haramategeko',
            email: 'robertharamategeko3@gmail.com'
        },
        { sex: 'm', login: 'Agustin Saxe', email: 'agussaxe12@gmail.com' },
        {
            sex: 'fem',
            login: 'Nicolas Arrejuria',
            email: 'arrejurianicolas1@gmail.com'
        },
        { sex: 'fem', login: 'Momen Pal', email: 'palmomen56@gmail.com' },
        { sex: 'm', login: 'Ciro Juegos', email: 'juegosciro20@gmail.com' },
        { sex: 'm', login: 'Alan Farfan', email: 'farfanalan099@gmail.com' },
        { sex: 'fem', login: 'Low Battery', email: 'gobattery11@gmail.com' },
        { sex: 'fem', login: 'Marcos Tevez', email: 'tevez7383@gmail.com' },
        { sex: 'm', login: 'Pedro Londero', email: 'pedrolondero27@gmail.com' },
        {
            sex: 'm',
            login: 'Teymur agayev',
            email: 'teymur.agayev.1993@gmail.com'
        },
        { sex: 'm', login: 'Ariel TCACH', email: 'arieltcach40@gmail.com' },
        {
            sex: 'm',
            login: 'Mariano Lescano',
            email: 'lescanomariano821@gmail.com'
        },
        { sex: 'm', login: 'Minh Long', email: 'ml9773486@gmail.com' },
        {
            sex: 'm',
            login: 'Fermin miguel Lissa',
            email: 'ferminlissa07@gmail.com'
        },
        { sex: 'm', login: 'Jonathan Monzón', email: 'jonach0567@gmail.com' },
        {
            sex: 'fem',
            login: 'Mayiaas Mabvad',
            email: 'mayiaasmabvad@gmail.com'
        },
        { sex: 'm', login: 'Lionel Soto', email: 'sotolionel865@gmail.com' },
        {
            sex: 'm',
            login: 'David Elisha',
            email: 'davidelisha02345@gmail.com'
        },
        {
            sex: 'm',
            login: 'Virginia Avalos',
            email: 'avalosvirginia231@gmail.com'
        },
        { sex: 'fem', login: 'Diego Sosa', email: 'dsosa7819@gmail.com' },
        {
            sex: 'm',
            login: 'Fernando undefined',
            email: 'ferchuuu.17201107@gmail.com'
        },
        { sex: 'm', login: 'Santiago Nunez', email: 'sannti.nu99@gmail.com' },
        {
            sex: 'fem',
            login: 'Santiago Cabral',
            email: 'santiagocabral1807@gmail.com'
        },
        { sex: 'fem', login: 'Agustin Garcia', email: 'elagus844@gmail.com' },
        { sex: 'm', login: 'Bautista Vanoli', email: 'vanolibauti5@gmail.com' },
        {
            sex: 'm',
            login: 'Mateo Albarracin',
            email: 'albarracin2408@gmail.com'
        },
        { sex: 'm', login: 'Junior Trece', email: 'juniortrece213@gmail.com' },
        {
            sex: 'm',
            login: 'Lautaro Rodera',
            email: 'lautixroder011@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Facundo Giuliano Ponce Barrionuevo',
            email: 'giulianoobarrionuevo@gmail.com'
        },
        { sex: 'm', login: 'Aron Mercadal', email: 'aronmercadal63@gmail.com' },
        {
            sex: 'fem',
            login: 'Arhanarush khot',
            email: 'arhanarushkhot1008@gmail.com'
        },
        { sex: 'm', login: 'Миша Сиротин', email: 'misasirotin456@gmail.com' },
        { sex: 'm', login: 'Luis Prado', email: 'luisdavidprado520@gmail.com' },
        {
            sex: 'fem',
            login: 'Cristian cellular',
            email: 'cristiancellular77@gmail.com'
        },
        { sex: 'm', login: 'Hernan Gonzalez', email: 'hernangon83@gmail.com' },
        { sex: 'm', login: 'Huyti Uyti', email: 'uytihuyti@gmail.com' },
        { sex: 'm', login: 'Alejo undefined', email: 'alejo.mv1931@gmail.com' },
        {
            sex: 'm',
            login: 'Francisco Gonzalez',
            email: 'gonzalezfrancisco2201@gmail.com'
        },
        { sex: 'm', login: 'Tomi Bordon', email: 'tbordon055@gmail.com' },
        {
            sex: 'm',
            login: 'Смолкович Василь',
            email: 'smolkovicvasil0@gmail.com'
        },
        { sex: 'fem', login: 'DJ BUTY', email: 'tobitizi23@gmail.com' },
        {
            sex: 'm',
            login: 'Matias undefined',
            email: 'm.agustintorres1@gmail.com'
        },
        { sex: 'm', login: 'ccc kkk', email: 'ccck2000123@gmail.com' },
        {
            sex: 'fem',
            login: 'Husam Elrashied',
            email: 'hasomialbasomi@gmail.com'
        },
        {
            sex: 'm',
            login: 'Jeremias Oscar Crettaz',
            email: 'jeremiasocrettaz@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Mauro Cazuela',
            email: 'santiagosotocorno9@gmail.com'
        },
        { sex: 'm', login: 'Pablo Pavón', email: 'pavonpablo456@gmail.com' },
        {
            sex: 'fem',
            login: 'fachero420 undefined',
            email: 'facherazo420@gmail.com'
        },
        { sex: 'fem', login: 'Jonathan Cano', email: 'jc2297771@gmail.com' },
        { sex: 'm', login: 'Tam Car', email: 'tamcarx9@gmail.com' },
        {
            sex: 'm',
            login: 'Victor Bautista',
            email: 'bautistavictor595@gmail.com'
        },
        {
            sex: 'm',
            login: 'Joaquín Benítez',
            email: 'joaquinjavierbenitez@gmail.com'
        },
        { sex: 'm', login: 'Miguel Mabvas', email: 'mabvasmiguel@gmail.com' },
        {
            sex: 'fem',
            login: 'Braian Emmanuel Cajal',
            email: 'braianemmanuelcajal@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Vinod Shukla',
            email: 'binodshukla1984000@gmail.com'
        },
        { sex: 'fem', login: 'Leonardo Vilte', email: 'florol19934@gmail.com' },
        { sex: 'm', login: 'Ali Akduman', email: 'aliafyonlu23@gmail.com' },
        { sex: 'm', login: 'منير الباشا', email: 'mnyra1352@gmail.com' },
        {
            sex: 'm',
            login: 'cristian basualdo',
            email: 'cristianbasualdoruso@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Temiloluwa Lizzy',
            email: 'temiloluwalizzy67@gmail.com'
        },
        {
            sex: 'm',
            login: 'Mahdi Sepehrara',
            email: 'mahdisepehrara77@gmail.com'
        },
        { sex: 'm', login: 'mustaan farid', email: 'mustaanf16@gmail.com' },
        {
            sex: 'fem',
            login: 'João Gregório Katchitane',
            email: 'katchitanej@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Irvan Mahendra',
            email: 'irvanmahendra4489@gmail.com'
        },
        {
            sex: 'm',
            login: 'Andres Ferreyra',
            email: 'andresprotection@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Asif Al Arman',
            email: 'asifalarman40951@gmail.com'
        },
        { sex: 'fem', login: 'Thiago cho', email: 'thiagoraxing@gmail.com' },
        {
            sex: 'm',
            login: 'Cristhian Baez',
            email: 'cristhianbaez415@gmail.com'
        },
        {
            sex: 'fem',
            login: 'nico gonzalez',
            email: 'nico.g.acosta08@gmail.com'
        },
        { sex: 'm', login: 'Sony Network', email: 'sonynetwork042@gmail.com' },
        { sex: 'fem', login: 'Thiago Melgar', email: 'melgart49@gmail.com' },
        {
            sex: 'fem',
            login: 'Lautaro Fernandez',
            email: 'laufer2004d@gmail.com'
        },
        { sex: 'fem', login: 'James undefined', email: 'j87413568@gmail.com' },
        {
            sex: 'm',
            login: 'Mateo Iaccarino',
            email: 'davidmateoiaccarino17@gmail.com'
        },
        { sex: 'm', login: 'Angel Ovelar', email: 'angelovelar112@gmail.com' },
        { sex: 'm', login: 'Dante Piñero', email: 'pinerodante0@gmail.com' },
        { sex: 'm', login: 'Uriel Gonzalez', email: 'ug276852@gmail.com' },
        { sex: 'm', login: 'Tadeo Molina', email: 'tadeomolina71@gmail.com' },
        { sex: 'm', login: 'Ivan Sánchez', email: 'ivansanc58@gmail.com' },
        { sex: 'm', login: 'Juan Marchisio', email: 'jmarchisio93@gmail.com' },
        { sex: 'fem', login: 'Pablo Aunins', email: 'aunins.pablo@gmail.com' },
        { sex: 'fem', login: 'Juan De souso', email: 'juandesouso@gmail.com' },
        {
            sex: 'm',
            login: 'Pandulce Dulce',
            email: 'pandulcedulce06@gmail.com'
        },
        { sex: 'm', login: 'Gera Batalla', email: 'gerabatalla77@gmail.com' },
        { sex: 'm', login: 'Bauti Corzo', email: 'bauticorzo5@gmail.com' },
        {
            sex: 'fem',
            login: 'Tiziano Ariel Torres',
            email: 'tizianoarieltorres@gmail.com'
        },
        { sex: 'm', login: 'Marcos undefined', email: 'marcos4356n@gmail.com' },
        { sex: 'm', login: 'Mañana Vemos', email: 'mananavemos59@gmail.com' },
        {
            sex: 'm',
            login: 'Germán Canedo',
            email: 'canedogerman969@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Hugo Bauer',
            email: 'hugodiazbauer2002@gmail.com'
        },
        { sex: 'm', login: 'Alejo Luke', email: 'lukealejo17@gmail.com' },
        {
            sex: 'fem',
            login: 'yesica morales',
            email: 'yesicamorales7890@gmail.com'
        },
        { sex: 'fem', login: 'Santi Edén', email: 'santieden94@gmail.com' },
        { sex: 'm', login: 'Alejo Bona', email: 'bonaalejo317@gmail.com' },
        { sex: 'm', login: 'Braian Fara', email: 'farabraian6@gmail.com' },
        { sex: 'fem', login: 'Anus Gujjar', email: 'anusg5395@gmail.com' },
        {
            sex: 'm',
            login: 'Brandon Perez',
            email: 'perezbrandonagustin12@gmail.com'
        },
        {
            sex: 'fem',
            login: 'Ronan Galvaliz',
            email: 'ronangalvaliz@gmail.com'
        },
        { sex: 'm', login: 'Sergey Kuzin', email: 'repz.tatoo@gmail.com' },
        { sex: 'm', login: 'Сергій undefined', email: 'sn07092012@gmail.com' },
        { sex: 'm', login: 'Юрий Тромса', email: 'urijmasalov240@gmail.com' },
        {
            sex: 'm',
            login: 'Себастьян Перчук',
            email: 'sebastanpercuk59@gmail.com'
        },
        {
            sex: 'm',
            login: 'Jeremias Dario Oliva',
            email: 'jeremiasoliva0805@mi.unc.edu.ar'
        },
        { sex: 'm', login: 'Artem Rtyrrty', email: 'artemrtyrrty@gmail.com' },
        { sex: 'm', login: 'qw qw', email: 'qwq780668@gmail.com' },
        {
            sex: 'm',
            login: 'Дима Санатарчук',
            email: 'dmytrosanatarchuk@gmail.com'
        },
        { sex: 'm', login: 'Дмитро Гордійчук', email: 'gdmitro703@gmail.com' },
        { sex: 'm', login: 'Вася Лека', email: 'vasaleka913@gmail.com' },
        { sex: 'm', login: 'Rus Sha', email: 'shatorus980@gmail.com' },
        { sex: 'm', login: 'Walter Bauman', email: 'walterbauman61@gmail.com' }
    ];

    return (
        <div style={{ display: 'block', width: '100%' }}>
            <DataTable
                style={{ display: 'block', width: '100%' }}
                styles={{}}
                value={data ?? []}
                fontSizeHead={'14px'}
                emptyMessage="empty data"
                footer={undefined}
                data-source="table"
                refreshInterval={25000}
                data-type="DataTable"
            >
                <Column
                    sortable
                    key={'sex'}
                    field={'sex'}
                    header={
                        <div
                            style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                            }}
                        >
                            sex
                        </div>
                    }
                    body={(rowData, colProps) => (
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            {rowData['sex']}
                        </span>
                    )}
                />

                <Column
                    sortable
                    key={'login'}
                    field={'login'}
                    header={
                        <div
                            style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                            }}
                        >
                            login
                        </div>
                    }
                    body={(rowData, colProps) => (
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            {rowData['login']}
                        </span>
                    )}
                />

                <Column
                    sortable
                    key={'email'}
                    field={'email'}
                    header={
                        <div
                            style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                            }}
                        >
                            email
                        </div>
                    }
                    body={(rowData, colProps) => (
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            {rowData['email']}
                        </span>
                    )}
                />
            </DataTable>
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <DataTableWrap />
        </>
    );
}
