from selenium import webdriver
from PIL import Image
import time
import pytesseract
import base64
import io
import re
import gc
import logging
from bs4 import BeautifulSoup


def searching_links(browser):
    css_selector = "a[class=\"item-description-title-link\"]"
    list_urls = []

    for index in range(1, 3):
        base_url = f"https://www.avito.ru/sankt-peterburg/zhivotnye?q=%D0%BC%D0%BE%D0%BF%D1%81&p={index}"

        browser.get(base_url)
        time.sleep(1)

        try:
            results = browser.page_source
            soup = BeautifulSoup(results, 'html.parser')
            urls = soup.select(css_selector)

            for a in urls:
                list_urls.append("https://avito.ru{}".format(a.attrs['href']))
        except:
            logging.exception(Exception)
        del base_url
        del results
        del soup
        del urls
        gc.collect()
    time.sleep(1)
    with open("./avito_urls", "w") as file:
        for ref in list_urls:
            file.write("{}\n".format(ref))


def get_contacts(browser):
    xpath = "//a[@data-side='card']"
    css_selector_address = "div[class=\"seller-info-col\"] > div > div > a"
    css_selector_phone = "div[class=\"item-actions-line\"] > div > div > a"
    with open("./avito_urls", "r", newline="") as file:
        urls = [row.strip() for index, row in enumerate(file)]

    with open("./phones_avito.csv", "a", newline="") as file2:
        errors = 0
        for index, url in enumerate(urls):
            try:
                browser.get(url)
                button = browser.find_element_by_xpath(xpath)
                button.click()
                time.sleep(1)

                results = browser.page_source
                soup = BeautifulSoup(results, 'html.parser')

                address = soup.select(css_selector_address)[0].string

                try:
                    image = soup.select(css_selector_phone)[0].contents[0].attrs['src']

                except:
                    image = soup.select(css_selector_phone)[1].contents[0].attrs['src']

                image = image.split(',')[1]
                image_bytes = base64.b64decode(image)
                image = Image.open(io.BytesIO(image_bytes))

                try:
                    phone = pytesseract.image_to_string(image)
                    phone = ''.join(re.findall('\d+', phone)[1:])
                except Exception as e:
                    print(e)

                print(index)
                print(phone)

                file2.write("{};{}\n".format(phone, address.strip()))
                file2.flush()
                del results
                del soup
                del address
                del image
                del image_bytes
                del phone
                del button
                gc.collect()
                time.sleep(1)
            except:
                errors += 1
                if errors > 1000:
                    logging.error("To many errors while parsing")
                    break


def setup_logging():
    logging.basicConfig(format='[%(asctime)s] %(levelname).1s %(message)s',
                        filename='./parser_ avito.log',
                        datefmt='%Y.%m.%d %H:%M:%S',
                        level=logging.INFO)


def main():
    load_timeout = 1000
    browser = webdriver.Chrome('./chromedriver_linux64/chromedriver')
    browser.set_page_load_timeout(load_timeout)
    try:
        searching_links(browser)
        get_contacts(browser)


    finally:
        if browser is not None:
            browser.quit()


if __name__ == '__main__':
    setup_logging()
    main()
