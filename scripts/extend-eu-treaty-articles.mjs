import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const escapeHtml = value => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const jobs = [
  {
    lawId: 'eu-tfeu-2012',
    file: 'data/laws/eu-tfeu-2012.html',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A12016E%2FTXT',
    source: 'EUR-Lex, CELEX 12016E/TXT, versión española del TFUE consolidado, DOUE C 202 de 7 de junio de 2016.',
    articles: {
      4: [
        '1. La Unión dispondrá de competencia compartida con los Estados miembros cuando los Tratados le atribuyan una competencia que no corresponda a los ámbitos mencionados en los artículos 3 y 6.',
        '2. Las competencias compartidas entre la Unión y los Estados miembros se aplicarán a los siguientes ámbitos principales: el mercado interior; la política social, en los aspectos definidos en el Tratado; la cohesión económica, social y territorial; la agricultura y la pesca, con exclusión de la conservación de los recursos biológicos marinos; el medio ambiente; la protección de los consumidores; los transportes; las redes transeuropeas; la energía; el espacio de libertad, seguridad y justicia; y los asuntos comunes de seguridad en materia de salud pública, en los aspectos definidos en el Tratado.',
        '3. En investigación, desarrollo tecnológico y espacio, la Unión dispondrá de competencia para llevar a cabo acciones, en particular programas, sin impedir que los Estados miembros ejerzan la suya.',
        '4. En cooperación para el desarrollo y ayuda humanitaria, la Unión dispondrá de competencia para llevar a cabo acciones y una política común, sin impedir que los Estados miembros ejerzan la suya.'
      ],
      45: [
        '1. Quedará asegurada la libre circulación de los trabajadores dentro de la Unión.',
        '2. La libre circulación supondrá la abolición de toda discriminación por razón de la nacionalidad entre los trabajadores de los Estados miembros respecto al empleo, la retribución y las demás condiciones de trabajo.',
        '3. Sin perjuicio de las limitaciones justificadas por razones de orden público, seguridad y salud públicas, la libre circulación implicará el derecho a responder a ofertas efectivas de trabajo, desplazarse libremente, residir en un Estado miembro para ejercer un empleo y permanecer en él después de haberlo ejercido.',
        '4. Las disposiciones del artículo no serán aplicables a los empleos en la administración pública.'
      ],
      59: [
        '1. A efectos de alcanzar la liberalización de un servicio determinado, el Parlamento Europeo y el Consejo, con arreglo al procedimiento legislativo ordinario y previa consulta al Comité Económico y Social, decidirán mediante directivas.',
        '2. Las directivas se referirán, en general, con prioridad, a los servicios que influyan de forma directa en los costes de producción o cuya liberalización contribuya a facilitar los intercambios de mercancías.'
      ],
      234: [
        'El Parlamento Europeo, en caso de que se le someta una moción de censura sobre la gestión de la Comisión, sólo podrá pronunciarse sobre dicha moción transcurridos tres días como mínimo desde su presentación y en votación pública.',
        'Si la moción de censura es aprobada por mayoría de dos tercios de los votos emitidos que representen, a su vez, la mayoría de los diputados que componen el Parlamento Europeo, los miembros de la Comisión deberán dimitir colectivamente y el Alto Representante de la Unión para Asuntos Exteriores y Política de Seguridad deberá dimitir del cargo que ejerce en la Comisión.',
        'Los miembros permanecerán en sus cargos y continuarán despachando los asuntos de administración ordinaria hasta que sean sustituidos conforme al artículo 17 del Tratado de la Unión Europea.'
      ],
      285: [
        'La fiscalización, o control de cuentas de la Unión, será efectuada por el Tribunal de Cuentas.',
        'El Tribunal de Cuentas estará compuesto por un nacional de cada Estado miembro. Sus miembros ejercerán sus funciones con plena independencia, en interés general de la Unión.'
      ],
      312: [
        '1. El marco financiero plurianual tendrá por objeto garantizar la evolución ordenada de los gastos de la Unión dentro del límite de sus recursos propios. Se establecerá para un período mínimo de cinco años. El presupuesto anual de la Unión respetará el marco financiero plurianual.',
        '2. El Consejo adoptará con arreglo a un procedimiento legislativo especial un reglamento que fije el marco financiero plurianual. El Consejo se pronunciará por unanimidad, previa aprobación del Parlamento Europeo, que se pronunciará por mayoría de los miembros que lo componen.',
        '3. El marco financiero fijará los importes de los límites máximos anuales de créditos para compromisos, por categoría de gastos, y del límite máximo anual de créditos para pagos.',
        '4. Si al vencimiento del marco financiero anterior no se ha adoptado el reglamento del Consejo por el que se establece uno nuevo, se prorrogarán los límites máximos y las demás disposiciones correspondientes al último año hasta que se adopte dicho acto.',
        '5. Durante el procedimiento de adopción del marco financiero, el Parlamento Europeo, el Consejo y la Comisión adoptarán todas las medidas necesarias para facilitar dicha adopción.'
      ]
    }
  },
  {
    lawId: 'eu-teu-2012',
    file: 'data/laws/eu-teu-2012.html',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A12016M%2FTXT',
    source: 'EUR-Lex, CELEX 12016M/TXT, versión española del TUE consolidado, DOUE C 202 de 7 de junio de 2016.',
    articles: {
      15: [
        '1. El Consejo Europeo dará a la Unión los impulsos necesarios para su desarrollo y definirá sus orientaciones y prioridades políticas generales. No ejercerá función legislativa alguna.',
        '2. El Consejo Europeo estará compuesto por los Jefes de Estado o de Gobierno de los Estados miembros, así como por su Presidente y por el Presidente de la Comisión. Participará en sus trabajos el Alto Representante de la Unión para Asuntos Exteriores y Política de Seguridad.',
        '3. El Consejo Europeo se reunirá dos veces por semestre por convocatoria de su Presidente. Cuando la situación lo exija, el Presidente convocará una reunión extraordinaria.',
        '4. El Consejo Europeo se pronunciará por consenso, excepto cuando los Tratados dispongan otra cosa.',
        '5. El Consejo Europeo elegirá a su Presidente por mayoría cualificada para un mandato de dos años y medio, que podrá renovarse una sola vez.',
        '6. El Presidente del Consejo Europeo presidirá e impulsará sus trabajos, velará por su preparación y continuidad, facilitará la cohesión y el consenso y presentará un informe al Parlamento Europeo al término de cada reunión. No podrá ejercer mandato nacional alguno.'
      ],
      20: [
        '1. Los Estados miembros que deseen instaurar entre sí una cooperación reforzada en el marco de las competencias no exclusivas de la Unión podrán hacer uso de las instituciones de ésta y ejercer dichas competencias conforme a los Tratados.',
        'La finalidad de las cooperaciones reforzadas será impulsar los objetivos de la Unión, proteger sus intereses y reforzar su proceso de integración. Estarán abiertas permanentemente a todos los Estados miembros.',
        '2. La decisión de autorizar una cooperación reforzada será adoptada por el Consejo como último recurso, cuando concluya que sus objetivos no pueden ser alcanzados en un plazo razonable por la Unión en su conjunto, y siempre que participen al menos nueve Estados miembros.',
        '3. Todos los miembros del Consejo podrán participar en las deliberaciones, pero sólo votarán los representantes de los Estados miembros participantes.',
        '4. Los actos adoptados en el marco de una cooperación reforzada vincularán únicamente a los Estados miembros participantes y no se considerarán acervo que deban aceptar los Estados candidatos a la adhesión.'
      ],
      49: [
        'Cualquier Estado europeo que respete los valores mencionados en el artículo 2 y se comprometa a promoverlos podrá solicitar el ingreso como miembro en la Unión. Se informará de esta solicitud al Parlamento Europeo y a los Parlamentos nacionales.',
        'El Estado solicitante dirigirá su solicitud al Consejo, que se pronunciará por unanimidad después de consultar a la Comisión y previa aprobación del Parlamento Europeo, que se pronunciará por mayoría de los miembros que lo componen.',
        'Se tendrán en cuenta los criterios de elegibilidad acordados por el Consejo Europeo.',
        'Las condiciones de admisión y las adaptaciones de los Tratados serán objeto de un acuerdo entre los Estados miembros y el Estado solicitante. Dicho acuerdo se someterá a ratificación por todos los Estados contratantes conforme a sus normas constitucionales.'
      ],
      50: [
        '1. Todo Estado miembro podrá decidir, de conformidad con sus normas constitucionales, retirarse de la Unión.',
        '2. El Estado miembro que decida retirarse notificará su intención al Consejo Europeo. La Unión negociará y celebrará con ese Estado un acuerdo que establecerá la forma de su retirada, teniendo en cuenta el marco de sus relaciones futuras con la Unión.',
        'El Consejo celebrará el acuerdo en nombre de la Unión por mayoría cualificada, previa aprobación del Parlamento Europeo.',
        '3. Los Tratados dejarán de aplicarse al Estado de que se trate desde la entrada en vigor del acuerdo de retirada o, en su defecto, a los dos años de la notificación, salvo prórroga unánime del Consejo Europeo de acuerdo con dicho Estado.',
        '4. El miembro del Consejo Europeo y del Consejo que represente al Estado miembro que se retire no participará en las deliberaciones ni decisiones que le afecten.',
        '5. Si el Estado miembro retirado solicita de nuevo la adhesión, su solicitud se someterá al procedimiento del artículo 49.'
      ]
    }
  }
];

const report = {
  generatedAt: '2026-08-01',
  source: 'EUR-Lex, versiones españolas consolidadas TUE/TFUE 2016/C 202/01.',
  inserted: [],
  skippedExisting: []
};

for (const job of jobs) {
  let html = await readFile(join(root, job.file), 'utf8');
  const sections = [];

  for (const [article, paragraphs] of Object.entries(job.articles)) {
    const anchorId = `${job.lawId}-a${article}`;
    if (html.includes(`id="${anchorId}"`) || html.includes(`data-anchor-id="${anchorId}"`)) {
      report.skippedExisting.push({ lawId: job.lawId, article, anchorId });
      continue;
    }
    sections.push(
      `<article id="${anchorId}" data-anchor-id="${anchorId}" data-ref="Artículo ${article}" data-source="${escapeHtml(job.source)}"><h2>Artículo ${article}</h2>${paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}<p class="source-note">Fuente oficial: <a href="${job.officialUrl}">${escapeHtml(job.source)}</a></p></article>`
    );
    report.inserted.push({ lawId: job.lawId, article, anchorId });
  }

  if (sections.length) {
    html = html.replace('</main>', `${sections.join('\n')}\n</main>`);
    await writeFile(join(root, job.file), html, 'utf8');
  }
}

await writeFile(join(root, 'data/eu-treaty-article-extension-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Artículos UE insertados: ${report.inserted.length}`);
console.log(`Ya existentes: ${report.skippedExisting.length}`);
