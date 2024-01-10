import { initialize } from '@ionic/core/components';
import { defineCustomElement as app } from '@ionic/core/components/ion-app';
import { defineCustomElement as button } from '@ionic/core/components/ion-button';
import { defineCustomElement as buttons } from '@ionic/core/components/ion-buttons';
import { defineCustomElement as card } from '@ionic/core/components/ion-card';
import { defineCustomElement as cardContent } from '@ionic/core/components/ion-card-content';
import { defineCustomElement as cardHeader } from '@ionic/core/components/ion-card-header';
import { defineCustomElement as cardTitle } from '@ionic/core/components/ion-card-title';
import { defineCustomElement as time } from '@ionic/core/components/ion-datetime';
import { defineCustomElement as input } from '@ionic/core/components/ion-input';
import { defineCustomElement as item } from '@ionic/core/components/ion-item';
import { defineCustomElement as list } from '@ionic/core/components/ion-list';
import { defineCustomElement as textArea } from '@ionic/core/components/ion-textarea';

initialize();

app();
button();
buttons();
list();
item();
input();
time();
card();
cardTitle();
cardHeader();
cardContent();
textArea();

