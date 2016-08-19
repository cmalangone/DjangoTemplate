import urllib, json
import config.settings
import sys
from django.http import HttpResponse
from django.core.mail import send_mail
from config.settings.local import EMAIL_SENDER, EMAIL_ENABLED
import csv
import xlwt

class CSVResponseMixin(object):
    #csv_filename = 'csvfile.csv'

    #def get_csv_filename(self):
    #    return self.csv_filename

    def export_xls(self, data, controls, xls_filename):
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename='+xls_filename
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet("Plate")
        letter_values={'A':1, 'B':2, 'C':3, 'D':4,'E':5,'F':6,'G':7,'H':8}
        letter_values_reverse={0:'',1:'A', 2:'B', 3:'C', 4:'D',5:'E', 6:'F', 7:'G', 8:'H'}
        row_num = 0

        columns = [
            (u"ID", 2000),
            (u"Title", 6000),
            (u"Description", 8000),
        ]

        font_style = xlwt.XFStyle()
        font_style.font.bold = True
        font_style.alignment.horz = xlwt.Alignment.HORZ_CENTER

        for row_num in range(9):
            ws.write(row_num,0,letter_values_reverse[row_num],font_style)
            # set column width
            ws.col(0).width = 2000

        for row_col in range(13):
            if row_col > 0:
                ws.write(0,row_col,row_col,font_style)

        font_style = xlwt.XFStyle()
        font_style.alignment.wrap = 1
        font_style.alignment.horz = xlwt.Alignment.HORZ_CENTER

        for obj in data:
            position = obj[1]
            letter = position[0]
            letter = letter.upper()
            number = int(position[1:3])
            row_index = int(letter_values[letter])
            row = ws.row(row_index)
            row.write(number,obj[2],font_style)

        font_style_cntrl = xlwt.XFStyle()
        font_style_cntrl.alignment.wrap = 1
        font_style_cntrl.alignment.horz = xlwt.Alignment.HORZ_CENTER
        font_style_cntrl.font.bold = True
        for cnt in controls:
            position = cnt[0]
            letter = position[0]
            letter = letter.upper()
            number = int(position[1:3])
            row_index = int(letter_values[letter])
            row = ws.row(row_index)
            row.write(number,cnt[1],font_style_cntrl)

        wb.save(response)
        return response

    def render_to_csv(self, data, csv_filename):
        response = HttpResponse(content_type='text/csv')
        cd = 'attachment; filename="{0}"'.format(csv_filename)
        response['Content-Disposition'] = cd

        writer = csv.writer(response)
        for row in data:
            writer.writerow(row)

        return response

    def render_to_csv_from_dict(self, data_dict, csv_filename):
        response = HttpResponse(content_type='text/csv')
        cd = 'attachment; filename="{0}"'.format(csv_filename)
        response['Content-Disposition'] = cd

        writer = csv.writer(response)
        number_of_samples = 91
        for order_id in range(1,92,1):
            if order_id in data_dict:
                writer.writerow(data_dict[order_id])
            else:
                writer.writerow("")

        return response


class SendEmailMixin(object):

    def send_email(self, subject, text, list_to):
        if EMAIL_ENABLED:
            try:
                #print(request.user.email)
                send_mail(subject, text,EMAIL_SENDER,list_to, fail_silently=False)
            except Exception as cre:
                print(str(cre))
                pass
            except:
                print("Unexpected error. Send MAIL FAILED")
                print(sys.exc_info()[0])
                pass
        return True

def get_model_dict(model):
    model_dict = {}
    for field in model._meta.fields:
         model_dict[field.get_attname_column()[0]] = ''

    return model_dict

def get_geocode(lat, long):
    geocode_data = {}
    coordinate = lat +","+long
    google_map = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+coordinate+"&key="+config.settings.local.GOOGLE_API_KEY
    result = {}
    #print(google_map)
    try:
        response = urllib.request.urlopen(google_map).read().decode("utf-8")
        result = json.loads(response)
    except urllib.error.URLError as err:
        result['status'] = 'KO'
        result['message'] = str(err.reason)


    geocode_data['status'] = result['status']
    if result['status'] == 'OK':
       #print(result['results'][0]['address_components'])
       geocode_data['location_type'] = str(result['results'][0]['geometry']['location_type'])
       geocode_data['address'] = str(result['results'][0]['formatted_address'])
       geocode_data['place_id'] = str(result['results'][0]['place_id'])
       for elem in result['results'][0]['address_components']:
           types = elem['types']
           if 'sublocality_level_2' in types:
               geocode_data['sublocality_level_2'] = elem['long_name']
           if 'sublocality_level_1' in types:
               geocode_data['sublocality_level_1'] = elem['long_name']
           if 'locality' in types:
               geocode_data['locality'] = elem['long_name']
           if 'administrative_area_level_1' in types:
               geocode_data['administrative_area_level_1'] = elem['long_name']
           if 'administrative_area_level_2' in types:
               geocode_data['administrative_area_level_2'] = elem['long_name']
           if 'administrative_area_level_3' in types:
               geocode_data['administrative_area_level_3'] = elem['long_name']
           if 'country' in types:
               geocode_data['country'] = elem['long_name']
               geocode_data['country_code'] = elem['short_name']
    else:
        if result['status'] == "ZERO_RESULTS":
            geocode_data['message'] = 'The coordinate are not corret. Invalid Location'
        else:
            geocode_data['message'] = result['status']

    return geocode_data
