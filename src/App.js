import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/form.pdf',
        licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        annotationManager.importAnnotationCommand(
          `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields><field name="form1[0].#subform[0].VolagNumber[0]"><value>gferssfredg</value></field></fields><add /><modify /><delete /></xfdf>`
        )
      });
  
      annotationManager.addEventListener('annotationChanged', (annotations, type, { imported }) => {
        if (imported) {
          return;
        }
        annotations.forEach(async annotation => {
          if (type === 'add') {
            const xfdf = await annotationManager.exportAnnotationCommand();
            console.log(`XFDF command: ${xfdf}`)
            let parentAuthorId = null;
            if (annotation.InReplyTo) {
              parentAuthorId = annotationManager.getAnnotationById(annotation.InReplyTo).authorId || 'default';
            }
          } else if (type === 'modify'){
            const xfdf = await annotationManager.exportAnnotationCommand();
            console.log(`XFDF command: ${xfdf}`)
            let parentAuthorId = null;
            if (annotation.InReplyTo) {
              parentAuthorId = annotationManager.getAnnotationById(annotation.InReplyTo).authorId || 'default';
            }
          } else if (type === 'delete') {
          }
        });
      });
        
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
